# Educational Board Management Portal - Project Blueprint

## PART 1: Project Context & Workflows

### 1.1 Project Overview
A modern, secure, and real-time educational management portal designed for an Islamic Educational Board and its affiliated institutes (Madaris). The system acts as a state-machine, governing student academic progression, admissions, fee management, and extensive historical record keeping. 

### 1.2 Architecture & Deployment Strategy
* **Tech Stack:** Next.js (App Router), Supabase (PostgreSQL, Auth, Storage), Vercel, and GitHub.
* **Deployment Model (Isolated Tenancy):** To maximize security, data isolation, and cloud free tiers, the project utilizes a shared GitHub codebase but deploys individual instances for each institute. Each institute gets its own Vercel project and Supabase database.
* **Data Integrity & Migration:** The system must support importing and seamlessly mapping legacy historical records (previous 3+ years of student data, examination centers, and affiliated institutes) into the new relational schema, ensuring a student's past academic history remains permanently accessible.

### 1.3 Security & Authentication
* **Authentication Method:** Users log in using their **CNIC** and a secure Password.
* **Security Protocol:** Supabase Auth handling JWTs. Strict Row Level Security (RLS) policies must be implemented on all tables to ensure users only access their authorized data.
* **Account Recovery:** Handled via the 'Resend' email API. When a user inputs their CNIC for password reset, the UI must securely mask the associated email (e.g., `m*****n@gmail.com`).
* **Audit Logging:** A comprehensive audit trail is required. Every CRUD (Create, Read, Update, Delete) action performed by any user must be logged with a timestamp and user ID for strict accountability.

### 1.4 UI/UX & Frontend Guidelines
* **Core Libraries:** `shadcn/ui` and Tailwind CSS for accessible, responsive, and professional UI components.
* **Apple & Google UI Inspired Design:** The design system uses premium pure white (`#ffffff`) light mode and pure black (`#000000`) or deep zinc dark mode backgrounds.
  - High contrast monochrome aesthetic (stark blacks/whites).
  - Minimalistic, ultra-thin borders and soft diffused shadows instead of heavy boxes.
  - Increased card corner radii (`rounded-2xl` / `1rem`), subtle micro-interactions/transitions.
* **Typography:**
  - **Primary (English):** `Inter` for clean, modern English typography.
  - **Urdu (Specialized):** `IBM Plex Sans Arabic` loaded natively via `next/font/google` and applied via a custom `font-urdu` Tailwind class to ensure all Urdu text renders beautifully without breaking layouts.
* **Brand Logo Header:** The main header of all dashboard views displays the official `logo.webp` alongside `bie-logo.svg` (for the title), including a CSS fallback element if `logo.webp` is missing.
* **Auth Page Experience:** Standard clean and modern authentication UI.
* **Form Draft Persistence (useFormDraft):** Forms use the custom `useFormDraft` hook which automatically:
  - Backs up input states to `localStorage` under dynamic keys on keystroke.
  - Intercepts page refresh/close events (`beforeunload`) to alert the user if they have unsaved changes.
  - Merges local drafts with database records upon loading, prioritizing local changes.
  - Auto-clears drafts upon successful submission.
* **File Upload Constraints:** Strict client-side and server-side validation limiting user image uploads (e.g., profile pictures, document scans) to a maximum size of **300 KB**.

### 1.5 Role-Based Access Control (RBAC) & Features

**A. Super Admin (Board Level)**
* Global control over the entire system.
* Manage and create academic sessions (e.g., 1448H/2026 Regular & Supply).
* Define global deadlines for fees (Normal, Late, Double, Triple).
* Configure curriculum: Set compulsory vs. elective subjects per degree.
* Release exam results globally.
* Retroactively add or edit historical user data (past sessions, marks, statuses).
* Assign specific module access to Board Clerks.

**B. Board Clerks**
* Access is strictly limited to modules assigned by the Super Admin.
* Modules include: Finance (fee verification), Data Entry (bulk processing), Result Updates, and Admission Verification.

**C. Institute (Madrasa) Head / Admin**
* Complete visibility over their specific Madrasa.
* Manage enrolled students, teacher profiles, and staff performance.
* Process bulk CSV data uploads for student registration and results.
* Oversee institute-level fee collection and outstanding balances.
* Download bulk Roll Number Slips (ZIP format containing individual PDFs) for approved students.

**D. Teachers**
* Dedicated portal to manage assigned classes.
* Mark daily attendance.
* Enter examination results and update general student progress.

**E. Parents & Students (Regular & Private)**
* **Parents:** Can link and manage multiple children under a single dashboard, viewing attendance, progress, and fee statuses for each.
* **Students:** Can view their entire historical academic record and apply for new admissions.
* **Private Students:** Can select a specific Madrasa from a dropdown during registration to act as their examination/attestation center. Their application remains `PENDING_ATTESTATION` until verified by the selected Madrasa.

### 1.6 Core Business Logic & Workflows

**A. The Admissions State-Machine**
* Progression is strictly determined by previous exam results.
* **Pass Workflow:** A "PASSED" status automatically unlocks the application for the next progressive degree (enforcing internal rules, e.g., age limits like 14+ for Khasa).
* **Fail Workflow:** A "FAILED" status in 1 or 2 subjects restricts the student to applying ONLY for a Supply (Zimni) exam. The system locks their subject selection to the exact subjects they failed.
* A CNIC or B-Form is strictly mandatory for any admission to be processed.

**B. Financial Integration & Deadlines**
* **Automated Fee Calculation:** The frontend UI automatically calculates the required fee based on the current date compared against the Admin-defined session deadlines (Normal, Late, Double).
* **Institute Bulk Payments:** Institutes can generate aggregate challans for bulk student admissions and upload manual bank receipts (e.g., Meezan Bank) for Finance Clerk verification.
* **Digital Gateways:** The architecture must support API integration for real-time digital payments via 1LINK, 1Bill, and other Pakistani banking services. Real-time webhooks will update a student's status to `PAID` instantly.

**C. Document Generation**
* **Roll Number Slips:** Auto-generated only when a student's status is `PAID` and `ADMIN_APPROVED`.
* Students can download their individual PDF. 
* Institutes can download all approved student slips concurrently in a ZIP file.

---

## PART 2: Database Architecture

### 2.1 Core Architecture & RBAC

**`roles`**
Defines the available system roles.
* `id` (UUID, PK) - Unique role identifier.
* `name` (VARCHAR, UNIQUE, NOT NULL) - e.g., 'super_admin', 'clerk_finance', 'institute_head', 'student'

**`user_profiles`**
Extends the Supabase `auth.users` table.
* `id` (UUID, PK, FK -> `auth.users(id)`)
* `role_id` (UUID, FK -> `roles(id)`)
* `cnic` (VARCHAR, UNIQUE, NOT NULL) - Used for login and identification.
* `full_name` (VARCHAR, NOT NULL)
* `contact_number` (VARCHAR)
* `is_active` (BOOLEAN, DEFAULT true)

### 2.2 Institutional & Infrastructure Data

**`institutes`** (Madaris)
Stores data for all affiliated organizations.
* `id` (UUID, PK)
* `affiliation_no` (VARCHAR, UNIQUE) - Board-assigned affiliation number.
* `name` (VARCHAR, NOT NULL)
* `head_user_id` (UUID, FK -> `user_profiles(id)`)
* `address` (TEXT, NOT NULL)

**`exam_centers`**
* `id` (UUID, PK)
* `name` (VARCHAR, NOT NULL)
* `location` (TEXT, NOT NULL)
* `capacity` (INT)

### 2.3 Academic Configuration

**`sessions`**
Controls academic years and strict global deadlines.
* `id` (UUID, PK)
* `title` (VARCHAR, NOT NULL) - e.g., "1448H / 2026 Regular".
* `type` (VARCHAR, NOT NULL) - 'REGULAR' or 'SUPPLY'.
* `normal_fee_date` (DATE, NOT NULL)
* `late_fee_date` (DATE, NOT NULL)
* `double_fee_date` (DATE, NOT NULL)
* `is_active` (BOOLEAN, DEFAULT false)

**`degrees`**
* `id` (UUID, PK)
* `name` (VARCHAR, NOT NULL) - e.g., "الثانوية العامة (اول)".
* `base_fee` (DECIMAL, NOT NULL)
* `min_age` (INT) - e.g., 14 for Sanviya Khasa.

**`subjects`**
* `id` (UUID, PK)
* `name` (VARCHAR, NOT NULL)

**`degree_subjects`** (Join Table)
* `id` (UUID, PK)
* `degree_id` (UUID, FK -> `degrees(id)`)
* `subject_id` (UUID, FK -> `subjects(id)`)
* `is_compulsory` (BOOLEAN, DEFAULT true)

### 2.4 Student & Enrollment Workflows

**`students`**
* `id` (UUID, PK, FK -> `user_profiles(id)`)
* `father_name` (VARCHAR, NOT NULL)
* `dob` (DATE, NOT NULL)
* `gender` (VARCHAR, NOT NULL) - 'MALE' or 'FEMALE'.
* `b_form_cnic` (VARCHAR, UNIQUE, NOT NULL)
* `permanent_address` (TEXT, NOT NULL)
* `profile_image_url` (TEXT) - Supabase Storage URL (<300kb).

**`enrollments`** (The State Machine)
* `id` (UUID, PK)
* `student_id` (UUID, FK -> `students(id)`)
* `session_id` (UUID, FK -> `sessions(id)`)
* `degree_id` (UUID, FK -> `degrees(id)`)
* `institute_id` (UUID, FK -> `institutes(id)`) - NULL for purely private, until attested.
* `exam_center_id` (UUID, FK -> `exam_centers(id)`)
* `enrollment_type` (VARCHAR, NOT NULL) - 'REGULAR', 'PRIVATE_PENDING', 'PRIVATE_ATTESTED'.
* `status` (VARCHAR, NOT NULL) - 'DRAFT', 'SUBMITTED', 'FEE_VERIFIED', 'APPROVED'.
* `assigned_roll_no` (VARCHAR, UNIQUE)

**`enrollment_subjects`**
Tracks specific subjects for this enrollment (crucial for Supply exams).
* `id` (UUID, PK)
* `enrollment_id` (UUID, FK -> `enrollments(id)`)
* `subject_id` (UUID, FK -> `subjects(id)`)
* `marks_obtained` (INT, DEFAULT NULL)
* `status` (VARCHAR, DEFAULT 'PENDING') - 'PASSED', 'FAILED', 'ABSENT'.

### 2.5 Finance & Payments

**`challans`**
Aggregates payments for individuals or bulk payments for institutes.
* `id` (UUID, PK)
* `institute_id` (UUID, FK -> `institutes(id)`) - NULL if private.
* `student_id` (UUID, FK -> `students(id)`) - NULL if bulk.
* `amount` (DECIMAL, NOT NULL)
* `psid` (VARCHAR, UNIQUE) - 1LINK Payment Slip ID.
* `status` (VARCHAR, DEFAULT 'UNPAID') - 'UNPAID', 'PAID', 'VERIFICATION_PENDING'.
* `receipt_url` (TEXT) - Link to uploaded manual bank receipt.

**`challan_enrollments`** (Join Table)
* `challan_id` (UUID, FK -> `challans(id)`)
* `enrollment_id` (UUID, FK -> `enrollments(id)`)

### 2.6 Global Audit Logging 

**`audit_logs`**
Automatically populated via PostgreSQL Triggers on INSERT/UPDATE/DELETE.
* `id` (UUID, PK)
* `table_name` (VARCHAR, NOT NULL)
* `record_id` (UUID, NOT NULL) - ID of the affected row.
* `action` (VARCHAR, NOT NULL) - 'INSERT', 'UPDATE', 'DELETE'.
* `performed_by` (UUID, FK -> `auth.users(id)`)
* `old_data` (JSONB) - Snapshot before change.
* `new_data` (JSONB) - Snapshot after change.
* `created_at` (TIMESTAMP, DEFAULT NOW())

**Implementation Note:** Create a generic PL/pgSQL function `log_audit_event()` to cast `OLD` and `NEW` records to JSONB and attach it to core tables.