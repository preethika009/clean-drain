import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = session.user as { role?: string };
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const users = await prisma.user.findMany({
      where: role ? { role: role as "CITIZEN" | "TECHNICIAN" | "ADMIN" } : undefined,
      select: { id: true, name: true, email: true, role: true, ward: true, zone: true, createdAt: true, isActive: true, _count: { select: { assignedTickets: true, reportedTickets: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("[GET /api/users]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
