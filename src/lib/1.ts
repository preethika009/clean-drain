import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface TicketEmailData {
    to: string;
    name: string;
    ackId: string;
    title: string;
    priority: string;
    address: string;
    status: string;
    submittedAt: string;
}

export async function sendTicketAcknowledgement(data: TicketEmailData) {
    const trackingUrl = `${process.env.APP_URL}/track/${data.ackId}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Clear Drain — Issue Acknowledgement</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background: #0a0f1e; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: linear-gradient(145deg, #0f172a, #1e293b); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #083344 0%, #0e7490 100%); padding: 40px 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .logo span { color: #67e8f9; }
    .header h2 { color: #cffafe; font-size: 16px; font-weight: 400; margin-top: 8px; }
    .body { padding: 32px; }
    .greeting { color: #f1f5f9; font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    .text { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
    .ack-box { background: rgba(8,145,178,0.1); border: 1px solid rgba(8,145,178,0.3); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; }
    .ack-label { color: #67e8f9; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .ack-id { color: #fff; font-size: 28px; font-weight: 800; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; margin-top: 4px; }
    .details { display: grid; gap: 12px; margin-bottom: 28px; }
    .detail-row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
    .detail-label { color: #64748b; font-size: 13px; }
    .detail-value { color: #e2e8f0; font-size: 13px; font-weight: 500; }
    .priority-urgent { color: #ef4444; }
    .priority-high { color: #f97316; }
    .priority-medium { color: #f59e0b; }
    .priority-low { color: #22c55e; }
    .btn { display: block; text-align: center; background: linear-gradient(135deg, #0891b2, #0e7490); color: #fff; font-weight: 700; font-size: 15px; padding: 16px 32px; border-radius: 12px; text-decoration: none; margin-bottom: 20px; }
    .footer { text-align: center; color: #475569; font-size: 12px; padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05); }
    .sla-note { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 10px; padding: 14px; margin-bottom: 24px; }
    .sla-note p { color: #fbbf24; font-size: 13px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">🚰 Clear<span>Drain</span></div>
        <h2>Complaint Acknowledgement</h2>
      </div>
      <div class="body">
        <p class="greeting">Hello ${data.name},</p>
        <p class="text">Your drain issue report has been received and registered in our system. Our team will review and address this at the earliest. Here are your ticket details:</p>
        
        <div class="ack-box">
          <div class="ack-label">Acknowledgement ID</div>
          <div class="ack-id">${data.ackId}</div>
        </div>

        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Issue Title</span>
            <span class="detail-value">${data.title}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${data.address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Priority</span>
            <span class="detail-value priority-${data.priority.toLowerCase()}">${data.priority}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">${data.status}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Submitted At</span>
            <span class="detail-value">${data.submittedAt}</span>
          </div>
        </div>

        <div class="sla-note">
          <p>⏱️ <strong>Resolution SLA:</strong> We are committed to resolving your issue within 7 working days. If unresolved, you may escalate using your Acknowledgement ID.</p>
        </div>

        <a href="${trackingUrl}" class="btn">Track Your Complaint →</a>
        
        <p class="text" style="font-size: 13px;">You can track your issue anytime at: <a href="${trackingUrl}" style="color: #67e8f9;">${trackingUrl}</a></p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Clear Drain Civic Platform. All rights reserved.</p>
        <p style="margin-top: 6px;">If you didn't submit this report, please contact support immediately.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.to,
        subject: `[${data.ackId}] Drain Issue Acknowledgement — Clear Drain`,
        html,
    });
}

export async function sendEscalationNotification(data: {
    supervisorEmail: string;
    ackId: string;
    citizenName: string;
    reason: string;
}) {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.supervisorEmail,
        subject: `🚨 ESCALATION: Ticket ${data.ackId} Requires Immediate Attention`,
        html: `
      <div style="font-family: Arial; background: #0a0f1e; color: #f1f5f9; padding: 24px; border-radius: 12px;">
        <h2 style="color: #ef4444;">⚠️ Escalation Alert</h2>
        <p>Ticket <strong>${data.ackId}</strong> has been escalated by citizen <strong>${data.citizenName}</strong>.</p>
        <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>Reason:</strong><br/>${data.reason}
        </div>
        <p>Please review and take immediate action on the Clear Drain admin panel.</p>
        <a href="${process.env.APP_URL}/admin/tickets/${data.ackId}" style="background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">View Ticket</a>
      </div>
    `,
    });
}

export async function sendBiMonthlyReminder(data: {
    to: string;
    name: string;
    ward: string;
}) {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.to,
        subject: "🚰 Bi-Monthly Drain Cleaning Reminder — Clear Drain",
        html: `
      <div style="font-family: Arial; background: #0a0f1e; color: #f1f5f9; padding: 32px; max-width: 600px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
        <h1 style="color: #22d3ee; font-size: 24px;">🚰 Routine Drain Maintenance Reminder</h1>
        <p>Dear <strong>${data.name}</strong>,</p>
        <p style="color: #94a3b8;">This is your bi-monthly reminder from <strong>Clear Drain</strong> for Ward <strong>${data.ward}</strong>.</p>
        <div style="background: rgba(8,145,178,0.1); border: 1px solid rgba(8,145,178,0.3); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #67e8f9; margin: 0 0 12px;">This Month's Checklist:</h3>
          <ul style="color: #cbd5e1; line-height: 2;">
            <li>✅ Clear debris and leaves from drain grates</li>
            <li>✅ Check for signs of blockage or slow drainage</li>
            <li>✅ Flush drains with water periodically</li>
            <li>✅ Report any damaged grates or covers</li>
            <li>✅ Avoid disposing of grease/waste near drains</li>
          </ul>
        </div>
        <p style="color: #94a3b8;">Notice a blocked drain? Report it immediately:</p>
        <a href="${process.env.APP_URL}/report" style="background: linear-gradient(135deg, #0891b2, #0e7490); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; display: inline-block; font-weight: bold;">Report a Drain Issue</a>
        <p style="color: #475569; font-size: 12px; margin-top: 24px;">To unsubscribe from reminders, visit your account settings at ${process.env.APP_URL}/settings</p>
      </div>
    `,
    });
}
