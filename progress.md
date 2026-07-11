# BIE (Board of Islamic Education) - Progress & Architecture Mind Map

## 1. Architectural Mind Map

*   **Core Infrastructure**
    *   **Next.js App Router:** Handling routing, server components, and API routes.
    *   **Supabase:** Auth, Database (PostgreSQL), Storage.
    *   **Middleware (`src/middleware.ts`):** 
        *   Session verification (JWT).
        *   Role-Based Access Control (RBAC) routing (redirecting unauthorized roles).
*   **Modular Architecture (Independent Components)**
    *   **Features/Modules (`src/features/`):** Encapsulating logic by domain to prevent bloated files.
        *   `auth`: Login, signup, recovery.
        *   `admissions`: State-machine logic, drafts, document verification.
        *   `finance`: Fee calculations, challan generation, 1LINK webhooks.
        *   `academic`: Sessions, subjects, marks entry.
    *   **Shared UI (`src/components/ui`):** shadcn/ui base components.
    *   **Role Portals (`src/app/(dashboard)/...`):** Each role gets its own isolated route group, consuming independent feature modules.

## 2. GitHub Project Directory Tree

```text
bie/
├── src/
│   ├── app/                    # Next.js App Router (Routes Only)
│   │   ├── (auth)/             # Public authentication routes
│   │   │   ├── login/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (dashboard)/        # Protected Routes (Role-based)
│   │   │   ├── backstage/
│   │   │   ├── clerk/
│   │   │   ├── institute/
│   │   │   ├── teacher/
│   │   │   └── student/
│   │   ├── api/                # Backend API Routes / Webhooks
│   │   │   └── webhooks/1link/
│   │   ├── globals.css         
│   │   └── layout.tsx          
│   ├── features/               # Domain-driven Modules (Keeps code modular & clean)
│   │   ├── auth/               # Auth logic
│   │   │   ├── components/     # e.g., LoginForm.tsx
│   │   │   ├── actions.ts      # Server actions
│   │   │   └── schemas.ts      # Zod validation
│   │   ├── admissions/         # Admission state machine
│   │   │   ├── components/     # Enrollment forms
│   │   │   ├── hooks/          # e.g., useFormDraft (Local Storage persistence)
│   │   │   └── logic.ts        # State transition logic
│   │   ├── finance/            # Fee calculation and Challans
│   │   └── results/            # Exam results and bulk uploads
│   ├── components/             # Global Reusable Components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Sidebar, Header, etc.
│   │   └── shared/             # Data tables, File uploaders (300KB limit)
│   ├── lib/                    # Core Utilities
│   │   ├── supabase/           # Supabase client (Server & Client)
│   │   └── utils.ts            
│   ├── middleware.ts           # Centralized Auth & RBAC Handling
│   └── types/                  # Global TypeScript Interfaces (Database schema types)
├── supabase/                   # Supabase local environment
│   ├── migrations/             # SQL Migrations (Schema & RLS Policies)
│   └── seed.sql                # Seed data for roles & degrees
├── public/                     # Static Assets (logos)
├── .env.local                  
└── package.json                
```

## 3. Key Design Decisions

*   **Feature-Sliced Design (`src/features`):** Instead of dumping all components into `src/components`, we group them by business domain (auth, finance, admissions). This ensures files remain small and components are decoupled.
*   **Centralized Middleware:** `middleware.ts` acts as the gatekeeper. It will verify the Supabase JWT, check the `user_profiles` role, and ensure a Teacher cannot access the `/super-admin` routes, completely independent of the page UI.
*   **Server Actions over API Routes:** For standard CRUD operations, we will prefer Next.js Server Actions co-located within their respective feature folders to keep data fetching close to the components. Webhooks (like 1LINK) will remain in `src/app/api`.
*   **Draft Persistence Hook:** We will create a custom hook `useFormDraft` inside `src/features/admissions/hooks` that automatically syncs form state to `localStorage` before submission.

## 4. Project Development Steps

To ensure a structured and manageable development process, the project will be executed in the following logical phases:

### Phase 1: Project Initialization & Infrastructure
*   Initialize Next.js (App Router) with TypeScript, Tailwind CSS, and shadcn/ui.
*   Set up the Supabase project.
*   Execute initial database migrations (Tables, Relationships, Roles).
*   Implement strict Row Level Security (RLS) policies and Database Triggers for Audit Logging.

### Phase 2: Authentication & Middleware Setup
*   Develop the clean, modern login and signup pages.
*   Integrate Supabase Auth (CNIC-based login).
*   Implement `middleware.ts` to enforce RBAC and route protection (e.g., blocking unauthorized access to `/backstage` or `/clerk`).
*   Set up account recovery via Resend email API (with email masking).

### Phase 3: Super Admin (`/backstage`) & Core Configurations
*   Develop the `backstage` portal.
*   Build CRUD interfaces for managing Academic Sessions and Fee Deadlines (Normal, Late, Double).
*   Build interfaces for managing Degrees, Subjects, and Curriculum rules (Compulsory vs. Elective).
*   Create modules for Super Admins to manually manage user profiles and assign Clerk modules.

### Phase 4: Institute Admin & Bulk Data Management
*   Develop the `institute` dashboard.
*   Implement UI for managing enrolled students and staff/teachers.
*   Build the bulk CSV upload feature to migrate historical data (past results, older sessions).

### Phase 5: Admissions State-Machine & Forms
*   Implement the `useFormDraft` hook for offline persistence.
*   Develop the progressive admission forms.
*   Enforce the "Pass/Fail" state-machine constraints (e.g., locking subjects for Supply exams).
*   Implement strict client and server-side file upload validations.

### Phase 6: Finance & Payments Integration
*   Implement the automated dynamic fee calculation engine.
*   Develop Challan generation for both individual students and bulk institute payments.
*   Set up the `/api/webhooks/1link` API routes to handle real-time digital payment confirmations.
*   Build the manual bank receipt upload verification UI for Finance Clerks.

### Phase 7: Document Generation & Finalization
*   Implement the Roll Number Slip generation engine (triggering only for `APPROVED` and `PAID` statuses).
*   Enable bulk downloading of slips (ZIP format containing PDFs) for Institutes.
*   Final end-to-end testing, RLS security audit, and Vercel deployment.
