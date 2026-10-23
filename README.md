# Clear Drain — Civic Drain Issue Tracking Platform

<div align="center">

![Clear Drain](https://img.shields.io/badge/Clear%20Drain-Civic%20Platform-0891b2?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)

**AI-powered civic drain maintenance & issue tracking application**

</div>

---

## 🌊 Overview

**Clear Drain** is a production-ready civic issue tracking platform dedicated to drain cleaning, blockage reporting, and sanitation resolution tracking. Built with Next.js 15, Prisma/PostgreSQL, Tailwind CSS, and the Gemini AI API.

---

## ✨ Features

| Module | Details |
|---|---|
| 🗺️ **Geotagged Reporting** | GPS auto-detect + interactive Leaflet map pin |
| 🤖 **AI Categorization** | Gemini API analyzes text & photos → Priority + Severity |
| 🎫 **Unique Ticket IDs** | `CD-2026-XXXX` format + automated email PDF acknowledgement |
| ⚡ **SLA Engine** | 7-day SLA tracking with auto-breach detection (6h cron) |
| 🚨 **Escalation System** | One-click escalation notifying admin supervisors |
| 📅 **Bi-Monthly Reminders** | Cron sends cleaning reminders on 1st & 15th of each month |
| 🌐 **Multilingual Chatbot** | ClearBot in 8 regional languages (Gemini-powered) |
| 📊 **Admin Analytics** | Recharts dashboards: zone heatmap, trends, SLA compliance |
| 📸 **Before/After Photos** | Citizens upload before; technicians upload after (enforced) |
| 🔐 **RBAC** | 3 roles: Citizen / Technician / Admin with strict API guards |

---

## 🗂️ Project Structure

```
clear-drain/
├── prisma/
│   ├── schema.prisma          # Full DB schema (Users, Tickets, Media, Escalations…)
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── app/
│   │   ├── page.tsx           # 🏠 Landing page
│   │   ├── login/             # 🔑 Login page
│   │   ├── register/          # 📝 Registration
│   │   ├── report/            # 📋 Multi-step issue report form
│   │   ├── dashboard/         # 📊 Role-aware dashboard
│   │   ├── track/[id]/        # 🔍 Ticket tracking page
│   │   ├── admin/
│   │   │   ├── analytics/     # 📈 City-wide analytics (Admin)
│   │   │   └── tickets/       # 🗃️ All tickets + assign (Admin)
│   │   ├── support/           # 💬 Customer support + FAQs
│   │   ├── privacy-policy/    # 📄 Privacy Policy
│   │   ├── terms-and-conditions/ # 📄 Terms & Conditions
│   │   ├── not-found.tsx      # 🚫 Custom 404 page
│   │   └── api/
│   │       ├── tickets/       # GET/POST tickets (RBAC)
│   │       ├── tickets/[id]/  # GET/PATCH individual ticket
│   │       ├── escalate/      # POST escalation (SLA check)
│   │       ├── chat/          # POST Gemini chatbot
│   │       ├── upload/        # POST media upload
│   │       ├── analytics/     # GET admin analytics
│   │       ├── users/         # GET users list (Admin)
│   │       └── auth/          # NextAuth + register
│   ├── components/
│   │   ├── MapPicker.tsx      # Leaflet GPS map component
│   │   └── ChatbotWidget.tsx  # Floating multilingual chatbot
│   └── lib/
│       ├── prisma.ts          # Prisma singleton
│       ├── auth.ts            # NextAuth config (JWT + RBAC)
│       ├── gemini.ts          # Gemini AI: analysis + chatbot
│       ├── email.ts           # Nodemailer: ack + escalation + reminders
│       ├── scheduler.ts       # node-cron: bi-monthly + SLA breach
│       └── utils.ts           # Helpers: ackId, SLA, formatting
└── .env.example               # Environment variables template
```

---

## 🚀 Local Setup

### Prerequisites
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **PostgreSQL 14+** — [postgresql.org](https://www.postgresql.org/download/)
- **Google Gemini API key** — [aistudio.google.com](https://aistudio.google.com/app/apikey)
- **Gmail App Password** — [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### Step 1 — Install Dependencies
```bash
cd "clean drain"
npm install
```

### Step 2 — Configure Environment
```bash
# Copy the template
copy .env.example .env.local

# Edit .env.local with your values:
# DATABASE_URL = your PostgreSQL connection string
# NEXTAUTH_SECRET = any 32+ char random string
# GEMINI_API_KEY = your Google AI Studio key
# SMTP_USER / SMTP_PASS = Gmail + App Password
```

### Step 3 — Set Up the Database
```bash
# Push schema to PostgreSQL
npm run db:push

# Seed demo data (creates demo accounts)
npm run db:seed
```

### Step 4 — Run the App
```bash
npm run dev
# App runs at http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 Citizen | `citizen@demo.com` | `demo1234` |
| 🔧 Technician | `tech@demo.com` | `demo1234` |
| 🏛️ Admin | `admin@demo.com` | `demo1234` |

---

## 🌐 Key Pages

| Route | Description |
|---|---|
| `/` | Landing page with features, how-it-works, stats |
| `/login` | Sign in (all roles) |
| `/register` | Citizen / Technician self-registration |
| `/report` | 4-step issue report with GPS + AI |
| `/dashboard` | Role-aware ticket dashboard |
| `/track/[id]` | Real-time ticket tracking by ack ID |
| `/track` | Public search by ack ID |
| `/admin/analytics` | City analytics charts (Admin only) |
| `/admin/tickets` | Full ticket management (Admin only) |
| `/support` | Support + FAQs |
| `/privacy-policy` | Privacy Policy |
| `/terms-and-conditions` | Terms & Conditions |

---

## 🤖 AI Pipeline (Gemini)

1. **Complaint Analysis** (`/api/tickets` POST)
   - Text description + optional photo → Gemini 1.5 Flash
   - Returns: `priority`, `severity`, `zone`, `tags`, `estimatedResolutionDays`, `confidence`

2. **Chatbot** (`/api/chat` POST)
   - Multilingual responses (8 languages)
   - Context-aware: accepts `ackId` for status queries
   - Quick prompts for common questions

---

## 📧 Email System (Nodemailer)

| Trigger | Template |
|---|---|
| Ticket submitted | Beautiful HTML ack email with ackId + tracking link |
| SLA breached + Escalation | Alert email to all admin supervisors |
| 1st & 15th of month | Bi-monthly drain cleaning reminder |

> **Gmail Setup:** Enable 2FA → Generate App Password → use in `SMTP_PASS`

---

## ⏰ Background Jobs (node-cron)

| Job | Schedule | Purpose |
|---|---|---|
| Bi-Monthly Reminder | `0 9 1,15 * *` | Send cleaning reminders to all registered residents |
| SLA Breach Checker | `0 */6 * * *` | Mark overdue tickets as `slaBreached: true` |

---

## 🛡️ API Security

All mutation endpoints require:
- Valid session (NextAuth JWT)
- Role checks:
  - `CITIZEN` — can only view own tickets, submit, escalate
  - `TECHNICIAN` — can update assigned tickets only
  - `ADMIN` — full access + analytics

---

## 🗃️ Database Schema (Prisma)

```
User ──┬── Ticket (reportedBy)
       └── Ticket (assignedTo)
              ├── Media (BEFORE_PHOTO / AFTER_PHOTO)
              ├── TicketUpdate (activity log)
              ├── Escalation
              └── Notification
Zone
Reminder
Session
```

---

## 🏗️ Production Deployment

```bash
# Build
npm run build

# For PostgreSQL — use connection pooling (PgBouncer / Supabase)
# DATABASE_URL="postgresql://..."

# For file uploads — replace local storage with S3:
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME

# Run
npm start
```

> **Recommended Platforms:** Vercel (Next.js) + Supabase (PostgreSQL) + Cloudflare R2 (media)

---

## 📞 Support

- 📧 support@cleardrain.gov.in  
- ☎️ 1800-DRAIN-HELP  
- 🌐 [/support](/support)
