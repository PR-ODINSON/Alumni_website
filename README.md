# IITRAM Alumni Relationship & Career Networking Platform

A production-ready, full-stack Alumni Platform built for the Institute of Infrastructure, Technology, Research and Management (IITRAM), Ahmedabad.

---

## Overview

The IITRAM Alumni Platform is a premium university ecosystem combining:

- **Alumni Network** — Searchable directory, profiles, career timelines
- **Career Platform** — Job postings, internships, referrals, application tracking
- **Mentorship Hub** — Mentor matching, session scheduling, feedback system
- **Event Management** — Reunions, workshops, webinars, RSVP & gallery
- **Professional Community** — Academic community feed, achievements, announcements
- **Institutional Archive** — IITRAM legacy, milestones, research collaboration
- **Startup Ecosystem** — Alumni-founded ventures, funding stages, sectors
- **Analytics Dashboard** — Visual data on alumni distribution, placement, industry

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI Framework |
| Vite 8 | Build tool |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| TanStack Query v5 | Data fetching & caching |
| Zustand | State management |
| Axios | HTTP client |
| React Hook Form + Zod | Form validation |
| Recharts | Data visualization |
| Socket.IO Client | Real-time messaging |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Passport.js (Google OAuth) | Social login |
| Socket.IO | Real-time events |
| Cloudinary | Media storage |
| Nodemailer | Email service |
| express-rate-limit | Rate limiting |
| Helmet | Security headers |

---

## Project Structure

```
Alumni/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── layout/       # Navbar, Sidebar, AuthLayout
│   │   │   └── ui/           # Avatar, Button, etc.
│   │   ├── pages/            # Route pages
│   │   │   ├── admin/        # Admin dashboard
│   │   │   ├── alumni/       # Alumni directory + profiles
│   │   │   ├── analytics/    # Analytics dashboard
│   │   │   ├── auth/         # Login, Register, OAuth
│   │   │   ├── community/    # Feed
│   │   │   ├── events/       # Events listing + detail
│   │   │   ├── jobs/         # Jobs + referrals
│   │   │   ├── legacy/       # IITRAM legacy archive
│   │   │   ├── mentorship/   # Mentorship hub
│   │   │   ├── messages/     # Real-time messaging
│   │   │   ├── notifications/# Notifications
│   │   │   ├── profile/      # User profile + edit
│   │   │   ├── research/     # Research collaboration
│   │   │   ├── startups/     # Startup ecosystem
│   │   │   ├── stories/      # Success stories
│   │   │   └── students/     # Student directory
│   │   ├── lib/
│   │   │   ├── api.ts        # Axios API helpers (all modules)
│   │   │   └── utils.ts      # Utility functions
│   │   ├── stores/
│   │   │   ├── authStore.ts  # Auth state (Zustand + persist)
│   │   │   └── uiStore.ts    # UI state (sidebar, theme)
│   │   └── types/            # TypeScript interfaces
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts   # MongoDB connection
│   │   │   ├── passport.ts   # Google OAuth strategy
│   │   │   └── cloudinary.ts # Cloudinary config
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Alumni.ts
│   │   │   ├── Student.ts
│   │   │   ├── Connection.ts
│   │   │   ├── Message.ts
│   │   │   ├── Post.ts
│   │   │   ├── Job.ts
│   │   │   ├── Event.ts
│   │   │   ├── Mentorship.ts
│   │   │   ├── Notification.ts
│   │   │   ├── SuccessStory.ts
│   │   │   └── ResearchProject.ts
│   │   ├── controllers/      # Route handlers
│   │   ├── routes/           # Express routers
│   │   ├── middleware/
│   │   │   ├── auth.ts       # JWT protect + RBAC
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validateRequest.ts
│   │   ├── services/
│   │   │   └── socketService.ts  # Socket.IO real-time
│   │   └── utils/
│   │       ├── jwt.ts
│   │       └── email.ts
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB 7.0+ (local or Atlas)
- npm or yarn

### 1. Clone and Install

```bash
# Backend
cd backend
cp .env.example .env
# Fill in your .env values
npm install
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 2. Environment Variables

**Backend** (`backend/.env`):
```
MONGODB_URI=mongodb://localhost:27017/iitram-alumni
JWT_ACCESS_SECRET=<strong-secret>
JWT_REFRESH_SECRET=<strong-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
CLOUDINARY_CLOUD_NAME=<your-cloud>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=<your@email.com>
EMAIL_PASS=<app-password>
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

### 3. Seed Data (Optional)

```bash
cd backend
npm run seed
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/:token
GET    /api/auth/verify-email/:token
GET    /api/auth/google
GET    /api/auth/google/callback
```

### Alumni
```
GET    /api/alumni              - Directory with filters
GET    /api/alumni/:userId      - Profile
PUT    /api/alumni/profile/me   - Update my profile
POST   /api/alumni/profile/career
GET    /api/alumni/mentors
GET    /api/alumni/distinguished
GET    /api/alumni/startups
```

### Posts / Feed
```
GET    /api/posts               - Feed with filters
POST   /api/posts               - Create post
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
GET    /api/posts/:id/comments
POST   /api/posts/:id/comments
```

### Jobs
```
GET    /api/jobs                - Listings with filters
POST   /api/jobs                - Post a job (alumni/admin)
POST   /api/jobs/:id/apply
POST   /api/jobs/:id/save
GET    /api/jobs/me/saved
GET    /api/jobs/me/applications
```

### Events
```
GET    /api/events
POST   /api/events
GET    /api/events/:id
POST   /api/events/:id/register
DELETE /api/events/:id/register
```

### Mentorship
```
POST   /api/mentorship/request
GET    /api/mentorship          - My mentorships
PATCH  /api/mentorship/:id/respond
POST   /api/mentorship/:id/sessions
POST   /api/mentorship/:id/feedback
```

### Messages
```
GET    /api/messages/conversations
POST   /api/messages/conversations
GET    /api/messages/conversations/:id/messages
POST   /api/messages/conversations/:id/messages
```

### Connections
```
POST   /api/connections/request/:userId
PATCH  /api/connections/:id/respond
GET    /api/connections/me
GET    /api/connections/pending
GET    /api/connections/status/:userId
```

### Analytics
```
GET    /api/analytics/overview
GET    /api/analytics/alumni-distribution
GET    /api/analytics/global-presence
GET    /api/analytics/placement-stats
GET    /api/analytics/startup-stats
```

---

## User Roles

| Role | Capabilities |
|---|---|
| `student` | Browse alumni, request mentorship, apply to jobs, community feed |
| `alumni` | Full profile, post jobs, mentor students, success stories |
| `faculty` | Browse directory, events, research collaboration |
| `admin` | User management, content moderation, analytics, verification |

---

## Key Features

### Alumni Directory
- Full-text search across name, company, location, skills
- Filters: batch, department, industry, country, employment status
- Career timeline visualization
- Mentorship availability indicator

### Career Platform
- Job/internship postings by alumni
- Referral request system
- Application tracking dashboard
- Save opportunities

### Mentorship Hub
- Mentor discovery with area-of-expertise filters
- Session scheduling with platform link
- Session history and notes
- Bidirectional feedback system

### Community Feed
- Post types: general, achievement, opportunity, announcement, research
- Rich media support
- Threaded comments
- Academic community design (not social media)

### Real-time Messaging
- One-on-one conversations
- Message read status
- Socket.IO powered
- Unread count badges

### Analytics Dashboard
- Alumni distribution by department, batch, industry
- Global presence map data
- Placement rate trends
- Startup ecosystem statistics

---

## Docker Deployment

```bash
# Copy env files
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f backend
```

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure MongoDB Atlas URI
- [ ] Set up Cloudinary account
- [ ] Configure Google OAuth credentials
- [ ] Set up SMTP (Gmail App Password / SendGrid)
- [ ] Enable HTTPS (certbot / reverse proxy)
- [ ] Set `NODE_ENV=production`
- [ ] Configure rate limiting appropriately

---

## AI Features (Prepared Backend Architecture)

The following AI-ready service stubs are prepared for integration:

- `/api/ai/resume-analysis` — Resume parsing and skill gap analysis
- `/api/ai/alumni-recommend` — Alumni recommendations based on interests
- `/api/ai/mentor-match` — ML-based mentor matching
- `/api/ai/career-assistant` — Career guidance chat
- `/api/ai/opportunity-match` — Job/opportunity recommendations

These are modular services designed to integrate with OpenAI, Gemini, or custom ML models.

---

## Architecture Decisions

- **Zustand** for lightweight client state with localStorage persistence
- **TanStack Query** for server state with automatic cache invalidation
- **Socket.IO** for real-time messaging and notifications
- **Tailwind CSS v4** with CSS-based `@theme` configuration
- **MongoDB** with compound indexes for optimized queries
- **JWT** with short-lived access tokens + refresh token rotation
- **Cloudinary** for image transformation and CDN delivery
- **Rate limiting** per-route (auth routes stricter)

---

## License

This project is built exclusively for IITRAM (Institute of Infrastructure, Technology, Research and Management). All rights reserved.

---

*Built with dedication for the IITRAM alumni community.*
