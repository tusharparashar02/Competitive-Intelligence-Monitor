# 🔍 CompetitorIQ — Competitive Intelligence Monitor

<div align="center">

![CompetitorIQ Banner](https://img.shields.io/badge/CompetitorIQ-Competitive%20Intelligence%20Monitor-1E40AF?style=for-the-badge&logoColor=white)

**Track competitors. Detect changes. Get AI-powered insights. Automatically.**

[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![.NET](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)](https://www.microsoft.com/sql-server)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Available-22C55E?style=for-the-badge)](https://your-vercel-app.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Why CompetitorIQ](#-why-competitoriq)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🧠 Overview

**CompetitorIQ** is a full stack SaaS application that automatically monitors competitor activity across multiple data sources and delivers AI-synthesized weekly intelligence briefings to businesses.

Instead of manually tracking competitor websites, job boards, and community forums — CompetitorIQ runs silently in the background 24/7, collects signals across sources, detects meaningful changes, and uses **Groq AI (Llama 3.3 70B)** to synthesize everything into plain-English insights delivered every Monday morning.

> 💡 Similar commercial tools like **Crayon** and **Klue** charge **$800–$1,500/month**.  
> CompetitorIQ delivers comparable intelligence at **zero infrastructure cost** using free tier services.

---

## 💡 Why CompetitorIQ

| Problem | How CompetitorIQ Solves It |
|---|---|
| Competitor changes pricing silently | Page monitoring detects diffs overnight |
| Competitor hiring signals missed | Job posting scraper detects hiring patterns |
| Community sentiment shifts unnoticed | Reddit API tracks mentions and scores sentiment |
| Product updates hard to track | RSS changelog monitoring captures every release |
| Insights take days to compile | Groq AI synthesizes all signals in seconds |

---

## ✨ Features

### 🏢 Competitor Management
- Add and track unlimited competitors
- Configure monitoring sources per competitor — jobs, pages, Reddit, RSS
- Set monitoring frequency — daily or weekly
- Activate or deactivate monitoring per competitor

### 🔍 Intelligence Monitoring
- **Job Posting Tracker** — Scrapes Indeed for competitor job postings, reveals hiring direction and team growth signals
- **Page Change Monitor** — Detects pricing page, landing page, and feature page changes using Playwright
- **Reddit Sentiment Tracker** — Monitors community mentions with automated sentiment scoring from -1.0 to +1.0
- **Changelog Feed** — Parses RSS feeds to track every competitor product update in real time

### 🤖 AI Intelligence Briefings
- Weekly reports generated every Monday via **Groq API (Llama 3.3 70B)**
- Synthesizes all collected signals into readable business insights
- Highlights opportunities, threats, and competitor strategic moves
- Delivered via email and available in-app

### 🔔 Real-Time Alerts
- **SignalR** push notifications for significant changes
- Severity levels — High, Medium, Low
- Unread badge counter on navbar
- Mark individual or all alerts as read

### 📊 Dashboard & Analytics
- Summary stats — total competitors, weekly alerts, changes detected
- Sentiment trend charts using **Recharts**
- Activity timeline across all competitors
- Paginated data views with clean loading states

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| TanStack Query | Server state management and caching |
| Recharts | Data visualization |
| React Router v6 | Client-side navigation |
| Axios | HTTP client |
| SignalR Client | Real-time WebSocket connection |
| Lucide React | Icon library |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core 8 Web API | REST API layer |
| Entity Framework Core | ORM and migrations |
| SQL Server | Primary database |
| Hangfire | Background job scheduling |
| SignalR | Real-time push notifications |
| AutoMapper | Object mapping |
| BCrypt.Net | Password hashing |
| JWT Bearer Auth | Authentication |
| Playwright (.NET) | Headless browser scraping |
| CodeHollow.FeedReader | RSS feed parsing |

### AI & External Services
| Service | Purpose | Cost |
|---|---|---|
| Groq API (Llama 3.3 70B) | AI synthesis | Free (14K req/day) |
| Reddit API | Community sentiment | Free (100 req/min) |
| Resend | Transactional email | Free (3K/month) |
| Vercel | Frontend hosting | Free |
| Render | Backend hosting | Free |

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Vercel)                    │
│     Dashboard | Competitors | Reports | Alerts          │
└─────────────────────────┬───────────────────────────────┘
                          │ REST API + SignalR
┌─────────────────────────▼───────────────────────────────┐
│           ASP.NET Core 8 Web API (Render)               │
│      Auth | CRUD | Notifications | Report API           │
└────────────┬──────────────────────────┬─────────────────┘
             │                          │
┌────────────▼────────────┐  ┌──────────▼──────────────────┐
│   SQL Server Database   │  │    Hangfire Scheduler        │
│   Users, Competitors    │  │    Runs daily at 3AM         │
│   Jobs, Reports, Alerts │  └──────┬──────────┬────────────┘
└─────────────────────────┘         │          │
                           ┌────────▼──┐  ┌────▼────────────┐
                           │ Job+Page  │  │ Reddit + RSS     │
                           │ Scrapers  │  │ Scrapers         │
                           │ Playwright│  │ Free APIs        │
                           └────┬──────┘  └────┬────────────┘
                                │   raw data    │
                           ┌────▼──────────────▼────┐
                           │    Groq API             │
                           │    Llama 3.3 70B        │
                           │    AI Synthesis         │
                           └────────────┬────────────┘
                                        │ weekly report
                           ┌────────────▼────────────┐
                           │    Resend Email API      │
                           │    Weekly Briefing       │
                           └─────────────────────────┘
```

### Backend Monolithic Layer Architecture

```
Controllers/          ← HTTP only. No business logic.
    │
BusinessLayer/        ← All business rules and validations
  Interfaces/
  Services/
    │
RepositoryLayer/      ← All database access via EF Core
  Interfaces/
  Repositories/
    │
Data/
  AppDbContext.cs     ← EF Core DbContext
  Migrations/
    │
Models/
  Entities/           ← EF Core entities
  DTOs/               ← Request and Response DTOs
  Enums/
    │
Mappings/             ← AutoMapper profiles
Middleware/           ← Exception handling, request logging
Extensions/           ← Service registration extensions
Helpers/              ← JWT helper, utilities
Jobs/                 ← Hangfire background job registration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/sql-server) or SQL Server Express (LocalDB)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/competitoriq.git
cd competitoriq
```

### 2. Backend Setup

```bash
# Navigate to backend
cd Backend

# Restore NuGet packages
dotnet restore

# Copy the example config and fill in your API keys
cp appsettings.Development.json.example appsettings.Development.json

# Run EF Core migrations
dotnet ef database update

# Start the backend
dotnet run
```

Backend will start at `http://localhost:5011`  
Swagger UI available at `http://localhost:5011/swagger`  
Health check at `http://localhost:5011/health`

### 3. Frontend Setup

```bash
# Navigate to frontend
cd ../Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.development

# Update .env.development with your values

# Start the frontend
npm run dev
```

Frontend will start at `http://localhost:5173`

### 4. Test Login

Use the seeded test account to verify everything works:

```
Email:    demo@example.com
Password: demo123
```

---

## 🔐 Environment Variables

> ⚠️ Secret files are gitignored. Copy the `.example` files and fill in your own values — never commit real keys.

### Backend — `appsettings.Development.json`

Copy from `appsettings.Development.json.example`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CompetitiveIntelligenceDb;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "Secret": "YOUR_JWT_SECRET_MINIMUM_32_CHARACTERS_LONG",
    "Issuer": "CompetitiveIntelligenceAPI",
    "Audience": "CompetitiveIntelligenceFrontend",
    "ExpiryInDays": 7
  },
  "GroqApi": {
    "BaseUrl": "https://api.groq.com/openai/v1",
    "ApiKey": "YOUR_GROQ_API_KEY",
    "Model": "llama3-8b-8192"
  },
  "RedditApi": {
    "ClientId": "YOUR_REDDIT_CLIENT_ID",
    "ClientSecret": "YOUR_REDDIT_CLIENT_SECRET",
    "UserAgent": "CompetitiveIntelligenceMonitor/1.0"
  },
  "EmailSettings": {
    "ApiKey": "YOUR_RESEND_API_KEY",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "CompeteIQ"
  }
}
```

### Frontend — `.env.development`

Copy from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5011/api
VITE_SIGNALR_HUB_URL=http://localhost:5011/hubs/notifications
```

### Frontend — `.env.production`

```env
VITE_API_BASE_URL=https://your-render-app.onrender.com/api
VITE_SIGNALR_HUB_URL=https://your-render-app.onrender.com/hubs/notifications
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |

### Competitors
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/competitors` | ✅ | List all competitors |
| POST | `/api/competitors` | ✅ | Add new competitor |
| GET | `/api/competitors/:id` | ✅ | Get competitor details |
| PUT | `/api/competitors/:id` | ✅ | Update competitor |
| DELETE | `/api/competitors/:id` | ✅ | Remove competitor |

### Intelligence Data
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/competitors/:id/jobs` | ✅ | Job postings |
| GET | `/api/competitors/:id/changes` | ✅ | Page changes |
| GET | `/api/competitors/:id/reviews` | ✅ | Reddit mentions |
| GET | `/api/competitors/:id/reviews/sentiment` | ✅ | Sentiment trend |
| GET | `/api/competitors/:id/changelog` | ✅ | RSS changelog entries |

### Reports & Alerts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reports` | ✅ | All weekly reports |
| GET | `/api/reports/:id` | ✅ | Single report |
| GET | `/api/alerts` | ✅ | All alerts |
| GET | `/api/alerts/unread-count` | ✅ | Unread badge count |
| PUT | `/api/alerts/:id/read` | ✅ | Mark single as read |
| PUT | `/api/alerts/read-all` | ✅ | Mark all as read |

> All paginated endpoints accept `?page=1&pageSize=20` query parameters.  
> Full API documentation available at `/swagger` when running locally.

---

## 📁 Project Structure

```
competitoriq/
├── Backend/                        ← ASP.NET Core 8 Backend
│   ├── Controllers/
│   ├── BusinessLayer/
│   │   ├── Interfaces/
│   │   └── Services/
│   ├── RepositoryLayer/
│   │   ├── Interfaces/
│   │   └── Repositories/
│   ├── Models/
│   │   ├── Entities/
│   │   ├── DTOs/
│   │   └── Enums/
│   ├── Mappings/
│   ├── Middleware/
│   ├── Extensions/
│   ├── Helpers/
│   ├── Jobs/
│   ├── Hubs/
│   ├── Data/
│   │   └── Migrations/
│   ├── appsettings.json
│   ├── appsettings.Development.json.example  ← copy → appsettings.Development.json
│   └── Program.cs
│
└── Frontend/                       ← React 18 Frontend
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   ├── competitors/
    │   │   ├── intelligence/
    │   │   ├── reports/
    │   │   ├── alerts/
    │   │   └── ui/
    │   ├── pages/
    │   ├── hooks/
    │   ├── services/
    │   ├── context/
    │   └── utils/
    ├── .env.example                ← copy → .env.development / .env.production
    └── vite.config.js
```

---

## 🗺 Roadmap

- [x] User authentication with JWT
- [x] Competitor management CRUD
- [x] RSS changelog monitoring
- [x] Reddit sentiment tracking
- [x] Job posting scraper
- [x] Page change monitoring with Playwright
- [x] Groq AI weekly report generation
- [x] Real-time SignalR alerts
- [x] Email delivery via Resend
- [ ] GitHub OAuth login
- [ ] Multi-user team workspace
- [ ] Competitor comparison view
- [ ] Export reports to PDF
- [ ] Mobile app (React Native)
- [ ] Chrome extension for quick competitor add

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature description"

# Push to the branch
git push origin feature/your-feature-name

# Open a Pull Request
```

<div align="center">

**⭐ Star this repo if you found it useful!**

*Built with ❤️ using React, ASP.NET Core 8, and Groq AI*

</div>
