import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Clear Drain database...");

  // ─── Create zones ─────────────────────────────────────────────────────────
  const zones = await Promise.all([
    prisma.zone.upsert({ where: { name: "North Zone" }, update: {}, create: { name: "North Zone", wards: ["Ward 1 - North", "Ward 2 - North"] } }),
    prisma.zone.upsert({ where: { name: "South Zone" }, update: {}, create: { name: "South Zone", wards: ["Ward 5 - South", "Ward 6 - South"] } }),
    prisma.zone.upsert({ where: { name: "Central Zone" }, update: {}, create: { name: "Central Zone", wards: ["Ward 3 - Central", "Ward 4 - Central"] } }),
    prisma.zone.upsert({ where: { name: "East Zone" }, update: {}, create: { name: "East Zone", wards: ["Ward 7 - East", "Ward 8 - East"] } }),
    prisma.zone.upsert({ where: { name: "West Zone" }, update: {}, create: { name: "West Zone", wards: ["Ward 9 - West", "Ward 10 - West"] } }),
  ]);
  console.log(`✅ Created ${zones.length} zones`);

  const hashedPass = await bcrypt.hash("demo1234", 12);

  // ─── Admin ────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin Supervisor",
      email: "admin@demo.com",
      password: hashedPass,
      role: "ADMIN",
      phone: "+91 9876543210",
      ward: "Ward 3 - Central",
      zone: "Central Zone",
      emailVerified: true,
    },
  });

  // ─── Technicians ──────────────────────────────────────────────────────────
  const tech1 = await prisma.user.upsert({
    where: { email: "tech@demo.com" },
    update: {},
    create: {
      name: "Rajan Kumar",
      email: "tech@demo.com",
      password: hashedPass,
      role: "TECHNICIAN",
      phone: "+91 9876543211",
      ward: "Ward 7 - East",
      zone: "East Zone",
      emailVerified: true,
    },
  });

  const tech2 = await prisma.user.upsert({
    where: { email: "tech2@demo.com" },
    update: {},
    create: {
      name: "Priya Menon",
      email: "tech2@demo.com",
      password: hashedPass,
      role: "TECHNICIAN",
      phone: "+91 9876543212",
      ward: "Ward 5 - South",
      zone: "South Zone",
      emailVerified: true,
    },
  });

  // ─── Citizens ─────────────────────────────────────────────────────────────
  const citizen = await prisma.user.upsert({
    where: { email: "citizen@demo.com" },
    update: {},
    create: {
      name: "Anitha Rajan",
      email: "citizen@demo.com",
      password: hashedPass,
      role: "CITIZEN",
      phone: "+91 9876543213",
      ward: "Ward 7 - East",
      zone: "East Zone",
      emailVerified: true,
    },
  });

  const citizen2 = await prisma.user.upsert({
    where: { email: "citizen2@demo.com" },
    update: {},
    create: {
      name: "Mohammed Faiz",
      email: "citizen2@demo.com",
      password: hashedPass,
      role: "CITIZEN",
      phone: "+91 9876543214",
      ward: "Ward 1 - North",
      zone: "North Zone",
      emailVerified: true,
    },
  });

  console.log(`✅ Created users: admin, 2 technicians, 2 citizens`);

  // ─── Sample Tickets ───────────────────────────────────────────────────────
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  const tickets = await Promise.all([
    prisma.ticket.upsert({
      where: { ackId: "CD-2026-DEMO1" },
      update: {},
      create: {
        ackId: "CD-2026-DEMO1",
        title: "Blocked storm drain overflowing near Central Market",
        description: "The storm drain near the Central Market entrance has been completely blocked for 3 days. Water is overflowing onto the road causing traffic issues and foul smell.",
        status: "IN_PROGRESS",
        priority: "URGENT",
        severity: "CRITICAL_BLOCKAGE",
        tags: ["blocked-grate", "flood-prone", "sewage-overflow"],
        latitude: 13.0827,
        longitude: 80.2707,
        address: "Central Market, Nehru Street, Ward 3, Chennai - 600 003",
        ward: "Ward 3 - Central",
        zone: "Central Zone",
        aiAnalysis: {
          priority: "URGENT",
          severity: "CRITICAL_BLOCKAGE",
          summary: "Severe drain blockage near market causing flooding and public health hazard.",
          suggestedTags: ["blocked-grate", "flood-prone", "sewage-overflow"],
          estimatedResolutionDays: 2,
          confidence: 0.94,
          zone: "Central Zone",
          reasoning: "Complete blockage with overflow indicates critical infrastructure failure requiring immediate intervention.",
        },
        aiConfidence: 0.94,
        slaDeadline: tomorrow,
        slaBreached: false,
        reportedById: citizen.id,
        assignedToId: tech1.id,
      },
    }),
    prisma.ticket.upsert({
      where: { ackId: "CD-2026-DEMO2" },
      update: {},
      create: {
        ackId: "CD-2026-DEMO2",
        title: "Foul smell from drain on residential street",
        description: "Strong sewage smell coming from the roadside drain near Ward 7 residential area for past 5 days.",
        status: "ASSIGNED",
        priority: "HIGH",
        severity: "FOUL_ODOR",
        tags: ["foul-smell", "sewage", "residential"],
        latitude: 13.0950,
        longitude: 80.2800,
        address: "12th Cross Street, Ward 7 - East, Chennai",
        ward: "Ward 7 - East",
        zone: "East Zone",
        aiAnalysis: {
          priority: "HIGH",
          severity: "FOUL_ODOR",
          summary: "Persistent foul odor from drain indicating partial blockage with sewage buildup.",
          suggestedTags: ["foul-smell", "sewage", "residential"],
          estimatedResolutionDays: 3,
          confidence: 0.87,
          zone: "East Zone",
          reasoning: "Multi-day odor indicates sewage accumulation. Health risk to residential community.",
        },
        aiConfidence: 0.87,
        slaDeadline: inFiveDays,
        slaBreached: false,
        reportedById: citizen.id,
        assignedToId: tech1.id,
      },
    }),
    prisma.ticket.upsert({
      where: { ackId: "CD-2026-DEMO3" },
      update: {},
      create: {
        ackId: "CD-2026-DEMO3",
        title: "Broken drain cover creating road safety hazard",
        description: "Drain cover on the main road is broken and missing. Vehicle and pedestrian safety at risk.",
        status: "ESCALATED",
        priority: "HIGH",
        severity: "STRUCTURAL_DAMAGE",
        tags: ["broken-cover", "road-damage", "safety-hazard"],
        latitude: 13.0700,
        longitude: 80.2600,
        address: "Anna Salai Main Road, Ward 1 - North, Chennai",
        ward: "Ward 1 - North",
        zone: "North Zone",
        aiAnalysis: {
          priority: "HIGH",
          severity: "STRUCTURAL_DAMAGE",
          summary: "Missing drain cover on arterial road poses immediate safety risk to vehicles and pedestrians.",
          suggestedTags: ["broken-cover", "road-damage", "safety-hazard"],
          estimatedResolutionDays: 1,
          confidence: 0.92,
          zone: "North Zone",
          reasoning: "Structural damage to drain infrastructure in high-traffic area requires urgent repair.",
        },
        aiConfidence: 0.92,
        slaDeadline: sevenDaysAgo,
        slaBreached: true,
        reportedById: citizen2.id,
      },
    }),
    prisma.ticket.upsert({
      where: { ackId: "CD-2026-DEMO4" },
      update: {},
      create: {
        ackId: "CD-2026-DEMO4",
        title: "Routine drain cleaning needed near school",
        description: "Drain near St. Mary's School is partially blocked with leaves and debris. Needs routine cleaning before monsoon.",
        status: "RESOLVED",
        priority: "LOW",
        severity: "ROUTINE_MAINTENANCE",
        tags: ["routine-cleaning", "leaf-blockage", "pre-monsoon"],
        latitude: 13.0600,
        longitude: 80.2500,
        address: "St. Mary's School Road, Ward 5 - South, Chennai",
        ward: "Ward 5 - South",
        zone: "South Zone",
        aiAnalysis: {
          priority: "LOW",
          severity: "ROUTINE_MAINTENANCE",
          summary: "Minor debris blockage in drain near educational institution. Routine cleaning required.",
          suggestedTags: ["routine-cleaning", "leaf-blockage"],
          estimatedResolutionDays: 7,
          confidence: 0.89,
          zone: "South Zone",
          reasoning: "Partial blockage with natural debris. Scheduled maintenance sufficient.",
        },
        aiConfidence: 0.89,
        slaDeadline: threeDaysAgo,
        slaBreached: false,
        resolvedAt: threeDaysAgo,
        reportedById: citizen2.id,
        assignedToId: tech2.id,
      },
    }),
  ]);

  console.log(`✅ Created ${tickets.length} sample tickets`);

  // ─── Escalation for Demo3 ─────────────────────────────────────────────────
  await prisma.escalation.upsert({
    where: { id: "seed-escalation-1" },
    update: {},
    create: {
      id: "seed-escalation-1",
      ticketId: tickets[2].id,
      raisedById: citizen2.id,
      reason: "SLA breached by 3 days. Broken drain cover causing accidents. Two motorcycles have already been damaged. Urgent action required.",
      status: "OPEN",
    },
  });

  // ─── Ticket updates ───────────────────────────────────────────────────────
  await prisma.ticketUpdate.createMany({
    skipDuplicates: true,
    data: [
      {
        ticketId: tickets[0].id, authorId: admin.id,
        content: "Ticket acknowledged. Assigned to Rajan Kumar — East Zone team.",
        status: "ACKNOWLEDGED", isPublic: true,
      },
      {
        ticketId: tickets[0].id, authorId: tech1.id,
        content: "On-site inspection completed. Blockage caused by construction debris. Cleaning crew dispatched.",
        status: "IN_PROGRESS", isPublic: true,
      },
      {
        ticketId: tickets[3].id, authorId: tech2.id,
        content: "Drain cleaned and cleared. Before/after photos uploaded. Issue resolved.",
        status: "RESOLVED", isPublic: true,
      },
    ],
  });

  console.log("✅ Created ticket updates");
  console.log("\n🎉 Database seeded successfully!\n");
  console.log("Demo Accounts:");
  console.log("  👤 citizen@demo.com  / demo1234  (Citizen)");
  console.log("  🔧 tech@demo.com     / demo1234  (Technician)");
  console.log("  🏛️ admin@demo.com    / demo1234  (Admin)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
