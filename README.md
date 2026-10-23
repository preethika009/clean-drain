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

**ClearDrain** is an existing civic issue tracking platform for drain cleaning, blockage reporting, and sanitation resolution tracking. It uses Next.js 15, Prisma/PostgreSQL, Tailwind CSS, and the Gemini AI API. A successful local build does not verify deployment credentials, database readiness, durable uploads, or authenticated user flows; complete those checks in staging before public launch.

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
# Copy the template (Linux/macOS)
cp .env.example .env.local

# Edit .env.local with your values:
# Fill all placeholders in .env.local; never commit it.
# The template lists the database, auth, AI, app URL, and SMTP variables.
```

### Step 3 — Set Up the Database
```bash
# Local development only: sync the Prisma schema to a disposable database.
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

Import the existing `preethika009/clean-drain` repository into a Next.js-capable host (for example, Vercel). Use the repository root, the standard Next.js build command (`npm run build`), and the standard start command (`npm start`). `postinstall` runs `prisma generate` from the checked-in schema.

The checked-in `.npmrc` keeps clean installs reproducible using legacy peer resolution because the existing React Leaflet/React 19 and NextAuth/Nodemailer peer ranges do not currently align. This is an install workaround, not a dependency-health fix; review and reconcile these versions before production.

Configure these values in the host's **server-side environment settings**, not in Git: `DATABASE_URL` (managed PostgreSQL connection string), `NEXTAUTH_SECRET` (a newly generated, long random secret), `NEXTAUTH_URL` and `APP_URL` (the final HTTPS origin), `GEMINI_API_KEY` (Google AI Studio), and `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM` (email delivery). See `.env.example` for names and placeholders. Do not use the example values in production.

**Database:** This repository currently has no checked-in `prisma/migrations` history. Do not run `db:push` against production. Provision the PostgreSQL database, review the current Prisma schema, and create/review an initial migration before enabling production traffic. Seed demo users only in a disposable development database.

**Uploads and background jobs:** The upload implementation writes under `public/uploads`, which is gitignored and is not durable on typical serverless hosts. Configure persistent object storage (for example, S3/R2) before relying on uploaded images in production. The in-process `node-cron` jobs also need a persistent worker or managed scheduler; a serverless web process is not a reliable scheduler.

Before launch, run lint/build and test registration, login, report submission, public tracking, admin assignment, and analytics against staging with the real database and email/AI settings. A dependency audit still reports advisories in packages with major-version fixes; review and test those upgrades separately. These checks have not been completed simply by building the frontend.

> **Suggested hosting pattern:** a Next.js host + managed PostgreSQL + persistent object storage + a separately managed scheduler/worker.

---

## 📞 Support

- 📧 support@cleardrain.gov.in  
- ☎️ 1800-DRAIN-HELP  
- 🌐 [/support](/support)
