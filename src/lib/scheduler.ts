import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { sendBiMonthlyReminder } from "@/lib/email";

let initialized = false;

export function initScheduler() {
  if (initialized) return;
  initialized = true;

  // ─── Bi-Monthly Reminder: 1st and 15th of every month at 9 AM ────────────
  cron.schedule("0 9 1,15 * *", async () => {
    console.log("[Scheduler] Running bi-monthly drain cleaning reminders...");
    try {
      const users = await prisma.user.findMany({
        where: { isActive: true, ward: { not: null } },
        select: { id: true, name: true, email: true, ward: true },
      });

      for (const user of users) {
        await sendBiMonthlyReminder({
          to: user.email,
          name: user.name,
          ward: user.ward!,
        });
        await prisma.reminder.create({
          data: {
            userId: user.id,
            type: "bi-monthly",
            subject: "Bi-Monthly Drain Cleaning Reminder",
            message: `Reminder sent to ${user.email}`,
            delivered: true,
          },
        });
      }
      console.log(`[Scheduler] Sent ${users.length} bi-monthly reminders.`);
    } catch (err) {
      console.error("[Scheduler] Bi-monthly reminder failed:", err);
    }
  });

  // ─── SLA Breach Checker: Every 6 hours ────────────────────────────────────
  cron.schedule("0 */6 * * *", async () => {
    console.log("[Scheduler] Checking SLA breaches...");
    try {
      const breached = await prisma.ticket.updateMany({
        where: {
          slaDeadline: { lte: new Date() },
          slaBreached: false,
          status: { notIn: ["RESOLVED", "CLOSED"] },
        },
        data: { slaBreached: true },
      });
      console.log(`[Scheduler] Marked ${breached.count} tickets as SLA breached.`);
    } catch (err) {
      console.error("[Scheduler] SLA check failed:", err);
    }
  });

  console.log("[Scheduler] Background jobs initialized.");
}
