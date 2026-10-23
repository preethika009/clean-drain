import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ackId: params.id },
      include: {
        reportedBy: { select: { id: true, name: true, email: true, phone: true } },
        assignedTo: { select: { id: true, name: true, email: true, phone: true } },
        media: true,
        escalations: {
          include: { raisedBy: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
        updates: {
          include: { ticket: { select: { ackId: true } } },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { id: string; role: string };
    const body = await req.json();
    const { status, assignedToId, note } = body;

    const ticket = await prisma.ticket.findUnique({ where: { ackId: params.id } });
    if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Permission checks
    if (user.role === "CITIZEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (user.role === "TECHNICIAN" && assignedToId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (assignedToId) updateData.assignedToId = assignedToId;
    if (status === "RESOLVED") updateData.resolvedAt = new Date();

    const updated = await prisma.ticket.update({
      where: { ackId: params.id },
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
