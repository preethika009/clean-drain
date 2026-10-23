import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

/**
 * Generate a unique Acknowledgement ID in the format CD-YYYY-XXXX
 * e.g., CD-2026-A3X7
 */
export function generateAckId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CD-${year}-${suffix}`;
}

/**
 * Calculate SLA deadline (7 working days from now)
 */
export function calculateSLADeadline(workingDays: number = 7): Date {
  const date = new Date();
  let daysAdded = 0;
  while (daysAdded < workingDays) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) daysAdded++; // Skip weekends
  }
  return date;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

/**
 * Get priority color class
 */
export function getPriorityClass(priority: string): string {
  const map: Record<string, string> = {
    URGENT: "badge-urgent",
    HIGH: "badge-high",
    MEDIUM: "badge-medium",
    LOW: "badge-low",
  };
  return map[priority] ?? "badge-low";
}

/**
 * Get status class
 */
export function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: "status-pending",
    ACKNOWLEDGED: "status-acknowledged",
    ASSIGNED: "status-assigned",
    IN_PROGRESS: "status-in_progress",
    RESOLVED: "status-resolved",
    CLOSED: "status-closed",
    ESCALATED: "status-escalated",
  };
  return map[status] ?? "status-pending";
}

/**
 * Check if a ticket's SLA is breached
 */
export function isSLABreached(slaDeadline: Date | string): boolean {
  return new Date() > new Date(slaDeadline);
}

/**
 * Days remaining until SLA breach
 */
export function daysUntilSLA(slaDeadline: Date | string): number {
  const diff = new Date(slaDeadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Convert file to base64 for AI analysis
 */
export async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export { uuidv4 };
