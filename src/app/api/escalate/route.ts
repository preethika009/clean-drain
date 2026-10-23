import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEscalationNotification } from "@/lib/email";
import { isSLABreached } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { id: string; role: string };
    if (user.role !== "CITIZEN") {
      return NextResponse.json({ error: "Only citizens can escalate" }, { status: 403 });
    }

    const body = await req.json();
    const { ackId, reason } = body;

    if (!ackId || !reason) {
      return NextResponse.json({ error: "ackId and reason are required" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { ackId },
      include: { reportedBy: true },
    });

    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    if (ticket.reportedById !== user.id) return NextResponse.json({ error: "Not your ticket" }, { status: 403 });

    // Check SLA breach
    if (!isSLABreached(ticket.slaDeadline) && ticket.status !== "ESCALATED") {
      return NextResponse.json({ error: "SLA period not yet expired. Escalation not allowed yet." }, { status: 400 });
    }

    const escalation = await prisma.escalation.create({
      data: {
        ticketId: ticket.id,
        raisedById: user.id,
        reason,
        status: "OPEN",
      },
    });

    // Update ticket status
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: "ESCALATED" },
    });

    // Notify supervisors
    const supervisors = await prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
      select: { email: true },
    });

    for (const supervisor of supervisors) {
      try {
        await sendEscalationNotification({
          supervisorEmail: supervisor.email,
          ackId,
          citizenName: ticket.reportedBy.name,
          reason,
        });
      } catch {
        // Non-fatal
      }
    }

    return NextResponse.json({ escalation }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/escalate]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
