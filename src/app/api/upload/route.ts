import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { id: string; role: string };
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const ticketId = formData.get("ticketId") as string;
    const mediaType = formData.get("type") as string; // BEFORE_PHOTO | AFTER_PHOTO

    if (!file || !ticketId || !mediaType) {
      return NextResponse.json({ error: "file, ticketId, and type are required" }, { status: 400 });
    }

    // Only technicians can upload AFTER photos
    if (mediaType === "AFTER_PHOTO" && user.role !== "TECHNICIAN") {
      return NextResponse.json({ error: "Only technicians can upload after photos" }, { status: 403 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public", "uploads", ticketId);
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop();
    const filename = `${mediaType.toLowerCase()}-${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();
    await writeFile(join(uploadDir, filename), Buffer.from(bytes));

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    const media = await prisma.media.create({
      data: {
        ticketId,
        type: mediaType as "BEFORE_PHOTO" | "AFTER_PHOTO" | "VIDEO" | "DOCUMENT",
        url: `/uploads/${ticketId}/${filename}`,
        filename,
        mimeType: file.type,
        sizeBytes: file.size,
        uploadedBy: user.id,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
