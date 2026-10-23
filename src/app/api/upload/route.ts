import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "video/mp4": "mp4",
};

const validMediaTypes = new Set(["BEFORE_PHOTO", "AFTER_PHOTO", "VIDEO", "DOCUMENT"]);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { id: string; role: string };
    const formData = await req.formData();
    const fileValue = formData.get("file");
    const ticketIdValue = formData.get("ticketId");
    const mediaTypeValue = formData.get("type");

    if (!fileValue || typeof fileValue === "string" || typeof ticketIdValue !== "string" || typeof mediaTypeValue !== "string") {
      return NextResponse.json({ error: "file, ticketId, and type are required" }, { status: 400 });
    }

    const file = fileValue;
    const ticketId = ticketIdValue;
    const mediaType = mediaTypeValue;
    if (!validMediaTypes.has(mediaType)) {
      return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
    }

    const extension = extensionByMimeType[file.type];
    if (!extension) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, reportedById: true, assignedToId: true },
    });
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    if (mediaType === "AFTER_PHOTO") {
      if (user.role !== "TECHNICIAN" || ticket.assignedToId !== user.id) {
        return NextResponse.json({ error: "Only the assigned technician can upload after photos" }, { status: 403 });
      }
    } else if (mediaType === "BEFORE_PHOTO") {
      const isReporter = user.role === "CITIZEN" && ticket.reportedById === user.id;
      if (user.role !== "ADMIN" && !isReporter) {
        return NextResponse.json({ error: "Only the reporting citizen or an administrator can upload before photos" }, { status: 403 });
      }
    } else if (user.role !== "ADMIN" && !(user.role === "TECHNICIAN" && ticket.assignedToId === user.id)) {
      return NextResponse.json({ error: "Only assigned staff can upload this media type" }, { status: 403 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "complaint-media";
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "File storage is not configured" }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const storagePath = `${ticket.id}/${mediaType.toLowerCase()}-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (uploadError) {
      console.error("[POST /api/upload] Supabase Storage upload failed");
      return NextResponse.json({ error: "Could not store the uploaded file" }, { status: 502 });
    }

    try {
      const media = await prisma.media.create({
        data: {
          ticketId: ticket.id,
          type: mediaType as "BEFORE_PHOTO" | "AFTER_PHOTO" | "VIDEO" | "DOCUMENT",
          url: storagePath,
          filename: `${mediaType.toLowerCase()}-${Date.now()}.${extension}`,
          mimeType: file.type,
          sizeBytes: file.size,
          uploadedBy: user.id,
        },
      });
      return NextResponse.json({ media }, { status: 201 });
    } catch (error) {
      await supabase.storage.from(bucket).remove([storagePath]).catch(() => undefined);
      throw error;
    }
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
