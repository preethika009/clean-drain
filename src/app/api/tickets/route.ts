import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAckId, calculateSLADeadline } from "@/lib/utils";
import { analyzeComplaint } from "@/lib/gemini";
import { sendTicketAcknowledgement } from "@/lib/email";
import { formatDate } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const ward = searchParams.get("ward");

    const user = session.user as { id: string; role: string };
    const where: Record<string, unknown> = {};

    // Citizens only see their own tickets
    if (user.role === "CITIZEN") {
      where.reportedById = user.id;
    }
    // Technicians see their assigned tickets
    if (user.role === "TECHNICIAN") {
      where.assignedToId = user.id;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (ward) where.ward = ward;

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          reportedBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          media: { select: { id: true, url: true, type: true } },
          escalations: { select: { id: true, status: true } },
          _count: { select: { updates: true } },
        },
        orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[GET /api/tickets]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { id: string; email: string; name: string };
    const body = await req.json();
    const {
      title,
      description,
      latitude,
      longitude,
      address,
      ward,
      tags,
      imageBase64,
      imageMimeType,
    } = body;

    if (!title || !description || !latitude || !longitude || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // AI Analysis
    const aiResult = await analyzeComplaint(description, imageBase64, imageMimeType);

    const ackId = generateAckId();
    const slaDeadline = calculateSLADeadline(7);

    const ticket = await prisma.ticket.create({
      data: {
        ackId,
        title,
        description,
        status: "PENDING",
        priority: aiResult.priority,
        severity: aiResult.severity,
        tags: aiResult.suggestedTags,
        latitude,
        longitude,
        address,
        ward: ward ?? "",
        zone: aiResult.zone,
        aiAnalysis: aiResult as unknown as Record<string, unknown>,
        aiConfidence: aiResult.confidence,
        slaDeadline,
        reportedById: user.id,
      },
    });

    // Send acknowledgement email
    try {
      await sendTicketAcknowledgement({
        to: user.email,
        name: user.name,
        ackId,
        title,
        priority: aiResult.priority,
        address,
        status: "PENDING",
        submittedAt: formatDate(new Date()),
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Non-fatal - continue
    }

    return NextResponse.json({ ticket, aiAnalysis: aiResult }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tickets]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
