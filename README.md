# AI Job Portal

Full-stack career platform: Spring Boot 3 (Java 17) + React 19 / Vite / TypeScript / Tailwind.

Live frontend: [java-job-portal.vercel.app](https://java-job-portal.vercel.app)  
Repo: [github.com/Aartid18/java-job-portal](https://github.com/Aartid18/java-job-portal)

## Features

- JWT auth (register, verify, login, refresh, forgot/reset password)
- Role-based portals: job seeker, recruiter, admin
- Candidate onboarding with real profile completion
- Resume builder (versions + templates) and ATS-style analyzer
- Job postings, browse/apply, Jaccard skill matching + skill-gap text
- Recruiter hub: post jobs, ranked applicants, status updates
- Notifications on application status / interview schedule
- Interview scheduling API
- Admin overview counts
- Optional demo seed data

## Stack

| Layer | Tech |
|--------|------|
| Backend | Spring Boot 3.2, Security + JWT, JPA, MySQL, PDFBox, OpenAPI |
| Frontend | React 19, TypeScript, Vite, Tailwind 4, Recharts, Axios |

## Local setup

### Prerequisites

- JDK 17+, Maven 3.9+, Node 20+, MySQL 8+

### Database

```sql
CREATE DATABASE job_portal;
```

Copy `backend/.env.example` if needed. Defaults in `application.properties`:

- DB: `root` / `root` on `localhost:3306/job_portal`
- `app.seed=true` seeds demo users when the DB has no users

### Backend

```bash
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080` · Swagger: `/swagger-ui/index.html`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:8080
npm run dev
```

UI: `http://localhost:5173`

### Demo accounts (when seed runs)

| Email | Role | Password |
|--------|------|----------|
| `admin@aijobportal.local` | ADMIN | `SeedPass1!` |
| `seeker@aijobportal.local` | JOB_SEEKER | `SeedPass1!` |
| `recruiter@aijobportal.local` | RECRUITER | `SeedPass1!` |

Turn seed off in production: `APP_SEED=false`.

## Deploy

**Vercel:** set Root Directory to `frontend` (not repo root). Set `VITE_API_URL` to your hosted backend URL.

**Backend:** deploy separately (Railway, Render, VPS, etc.) with MySQL, `JWT_SECRET`, `CORS_ORIGIN`, `FRONTEND_URL`, `APP_SEED=false`.

## Main routes

| Path | Who |
|------|-----|
| `/login`, `/register` | Public |
| `/onboarding` | Authenticated |
| `/candidate` | Seeker dashboard |
| `/candidate/jobs`, `/candidate/applications` | Browse & pipeline |
| `/candidate/resume-builder`, `/candidate/resume-analyzer` | Resumes |
| `/candidate/skill-gap` | Skill comparison |
| `/recruiter` | Jobs + ranked applicants |
| `/admin` | Platform counts |

## API map (auth required unless noted)

- `POST/GET /api/auth/**` — auth flows
- `GET/PUT /api/candidate/onboarding/**` — profile wizard
- `GET /api/candidate/dashboard` — readiness metrics
- `CRUD /api/candidate/resumes` — resume versions + analyze
- `GET /api/jobs` — public open jobs
- `CRUD /api/recruiter/jobs` — recruiter postings
- `POST/GET /api/candidate/applications` — apply / list
- `GET/PATCH /api/recruiter/applications` — review / status
- `GET/PATCH /api/notifications` — inbox
- `POST/GET /api/recruiter/interviews`, `GET /api/candidate/interviews`
- `GET /api/admin/overview` — admin only

## Notes

- Matching and resume scoring are **heuristic** (skill overlap / keyword rules), not LLM guarantees.
- Dev mode may expose verification tokens when `DEV_EXPOSE_TOKENS=true` (disable in production).
- Uploads land under `UPLOAD_DIR` (default `uploads/`).
