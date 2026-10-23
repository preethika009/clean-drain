import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { id: string; role: string };
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [
      totalTickets,
      resolvedTickets,
      pendingTickets,
      urgentTickets,
      slaBreachedTickets,
      escalatedTickets,
      ticketsByPriority,
      ticketsByStatus,
      ticketsByZone,
      recentTickets,
      weeklyTrend,
    ] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "RESOLVED" } }),
      prisma.ticket.count({ where: { status: { in: ["PENDING", "ACKNOWLEDGED"] } } }),
      prisma.ticket.count({ where: { priority: "URGENT", status: { notIn: ["RESOLVED", "CLOSED"] } } }),
      prisma.ticket.count({ where: { slaBreached: true, status: { notIn: ["RESOLVED", "CLOSED"] } } }),
      prisma.ticket.count({ where: { status: "ESCALATED" } }),
      prisma.ticket.groupBy({ by: ["priority"], _count: { _all: true } }),
      prisma.ticket.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.ticket.groupBy({ by: ["zone"], _count: { _all: true }, where: { zone: { not: null } } }),
      prisma.ticket.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { reportedBy: { select: { name: true } } },
      }),
      // Last 7 days trend
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM tickets
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ]);

    const resolutionRate = totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : "0";

    return NextResponse.json({
      stats: {
        totalTickets,
        resolvedTickets,
        pendingTickets,
        urgentTickets,
        slaBreachedTickets,
        escalatedTickets,
        resolutionRate: parseFloat(resolutionRate),
      },
      charts: {
        byPriority: ticketsByPriority,
        byStatus: ticketsByStatus,
        byZone: ticketsByZone,
        weeklyTrend,
      },
      recentTickets,
    });
  } catch (err) {
    console.error("[GET /api/analytics]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
