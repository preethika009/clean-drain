import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = await prisma.ticket.findUnique({
      where: { ackId: id },
      select: {
        id: true,
        ackId: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        severity: true,
        tags: true,
        latitude: true,
        longitude: true,
        address: true,
        ward: true,
        zone: true,
        aiAnalysis: true,
        aiConfidence: true,
        slaDeadline: true,
        slaBreached: true,
        resolvedAt: true,
        createdAt: true,
        updatedAt: true,
        reportedBy: { select: { name: true } },
        assignedTo: { select: { name: true } },
        media: { select: { id: true, url: true, type: true, filename: true } },
        escalations: {
          select: {
            id: true,
            status: true,
            reason: true,
            createdAt: true,
            raisedBy: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        updates: {
          where: { isPublic: true },
          select: { id: true, content: true, status: true, createdAt: true, isPublic: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    return NextResponse.json({ ticket });
  } catch (err) {
    console.error("[GET /api/tickets/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { id: string; role: string };
    const body = await req.json();
    const { status, assignedToId, note } = body;

    const ticket = await prisma.ticket.findUnique({
      where: { ackId: id },
      select: { id: true, assignedToId: true },
    });
    if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const validStatuses = new Set(["PENDING", "ACKNOWLEDGED", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED", "ESCALATED"]);
    if (status && !validStatuses.has(status)) {
      return NextResponse.json({ error: "Invalid ticket status" }, { status: 400 });
    }

    if (user.role !== "ADMIN" && user.role !== "TECHNICIAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (user.role === "TECHNICIAN") {
      if (ticket.assignedToId !== user.id || assignedToId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (status && !["IN_PROGRESS", "RESOLVED"].includes(status)) {
        return NextResponse.json({ error: "Technicians may only start or resolve assigned tickets" }, { status: 403 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (assignedToId) updateData.assignedToId = assignedToId;
    if (status === "RESOLVED") updateData.resolvedAt = new Date();

    const updated = await prisma.ticket.update({
      where: { ackId: id },
      data: updateData,
    });

    // Add update log
    if (note || status) {
      await prisma.ticketUpdate.create({
        data: {
          ticketId: ticket.id,
          authorId: user.id,
          content: note ?? `Status changed to ${status}`,
          status: status ?? undefined,
        },
      });
    }

    return NextResponse.json({ ticket: updated });
  } catch (err) {
    console.error("[PATCH /api/tickets/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
