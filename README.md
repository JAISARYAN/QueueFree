# QueueFree

> **Tagline:** SKIP THE LINE. SAVE YOUR TIME.  
> **Supporting Line:** Smarter queues. Faster care. Better healthcare experiences.

---

## 1. Executive Summary

**QueueFree** is an enterprise-grade, multi-hospital Outpatient Department (OPD) appointment scheduling and intelligent queue management platform. Built to bridge the technological divide across healthcare ecosystems, QueueFree eliminates physical waiting lines, optimizes doctor consultation schedules, balances walk-in and booked patient flows, and delivers transparent, real-time queue telemetry to patients and administrative staff.

The system connects five primary stakeholders through a unified, role-based platform:
1. **Patients:** Discover healthcare providers, book time slots, receive automated delay alerts, track live queue positions, and arrive just in time.
2. **Doctors:** Manage daily OPD schedules, review consultation queues, handle patient consultations, mark attendance, and adjust availability in real time.
3. **Receptionists / OPD Staff:** Check in arriving patients, issue tokens for walk-in arrivals, verify appointments, triage priority cases, and handle rescheduling.
4. **Hospital Administrators:** Configure hospital departments, doctors, operational shifts, consultation quotas, and inspect operational metrics.
5. **Platform Superadministrators:** Onboard hospital networks, oversee cross-tenant system compliance, manage billing/subscriptions, and monitor system health.

---

## 2. Core Architecture & Technology Stack

QueueFree follows a **modular monolithic architecture** with strict domain boundaries, separating the React single-page frontend application from the Django REST Framework backend API. This design guarantees clean separation of concerns, high developer velocity, and a straightforward migration path to distributed micro-services should scale demand it.

```
                      +-----------------------------------+
                      |      Client Browser / Mobile      |
                      |   React + Vite + TypeScript SPA   |
                      +-----------------+-----------------+
                                        |
                            REST API (HTTPS / JSON)
                                        |
                      +-----------------v-----------------+
                      |       Django REST Framework       |
                      |         Modular Monolith          |
                      |   [Accounts] [Hospitals] [Queues] |
                      |    [Doctors] [Bookings] [Audit]   |
                      +--------+-----------------+--------+
                               |                 |
                   SQL / Relational        Event Broker
                               |          (Future Phase)
                      +--------v--------+ +------v--------+
                      |   PostgreSQL    | | Redis Channels|
                      | 17+ (Relational)| | (WebSockets)  |
                      +-----------------+ +---------------+
```

### Approved Technology Stack

| Layer | Approved Technology | Purpose / Notes |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | Component-based, strictly typed UI layer |
| **Frontend Tooling** | Vite | Ultra-fast HMR and optimized production bundling |
| **Styling** | Tailwind CSS + Lucide Icons | Utility-first styling with accessible icon set |
| **Animation & UI** | Framer Motion + shadcn/ui foundations | Fluid interactions, accessible primitives |
| **Client Routing** | React Router DOM v7 | Declarative nested routing with layout boundaries |
| **Backend Framework** | Python 3.13 + Django 5.1 | High-integrity ORM, secure application core |
| **API Engine** | Django REST Framework (DRF) | Standardized RESTful endpoints and serializers |
| **API Documentation** | drf-spectacular (OpenAPI 3.0 / Swagger) | Automated schema generation and interactive UI |
| **Database** | PostgreSQL 17 | Relational ACID database with transactional locks |
| **Real-time (Future)** | Django Channels + Redis | WebSocket-based live queue progress and notifications |
| **Version Control** | Git | Monorepo structured version management |

---

## 3. Repository Directory Structure

```
QueueFree/
├── backend/                        # Django backend application
│   ├── apps/                       # Modular Django business domains
│   │   ├── accounts/               # User authentication, roles & profiles
│   │   ├── appointments/           # Time-slot allocation & booking models
│   │   ├── audit_logs/             # Immutable audit trail & HIPAA/DISHA compliance
│   │   ├── bookings/               # Patient booking workflow orchestrator
│   │   ├── core/                   # Shared base models, health check & utilities
│   │   ├── departments/            # Hospital clinical departments & specialties
│   │   ├── doctors/                # Doctor profiles, schedules & consultation limits
│   │   ├── hospitals/              # Multi-tenant hospital profiles & settings
│   │   ├── integrations/           # External HMS/EHR adapters (HL7/FHIR)
│   │   ├── notifications/          # Multi-channel alerts (SMS/WhatsApp/Push)
│   │   ├── patients/               # Patient demographic records & history
│   │   ├── payments/               # OPD fee capture & invoice generation
│   │   └── queue_management/       # Intelligent token sequencing & state machine
│   ├── config/                     # Core Django configuration
│   │   ├── asgi.py                 # ASGI entry point (HTTP & future WebSockets)
│   │   ├── settings.py             # Environment-aware Django settings
│   │   ├── urls.py                 # Root URL configuration & versioned router
│   │   └── wsgi.py                 # WSGI entry point for production HTTP servers
│   ├── requirements/               # Python dependency manifests
│   │   ├── base.txt                # Common framework requirements
│   │   ├── local.txt               # Local development dependencies
│   │   └── production.txt          # Production-grade deployment requirements
│   ├── .env.example                # Backend environment template
│   └── manage.py                   # Django CLI management script
│
├── frontend/                       # React + Vite + TypeScript application
│   ├── public/                     # Static assets served as-is
│   │   ├── branding/               # Logos, wordmarks, and identity vectors
│   │   ├── icons/                  # PWA and browser favicons
│   │   └── images/                 # Healthcare illustrations and imagery
│   ├── src/                        # Application source code
│   │   ├── assets/                 # Processed CSS and media assets
│   │   ├── components/             # Reusable UI component library
│   │   │   ├── common/             # Generic buttons, badges, inputs
│   │   │   ├── feedback/           # Loaders, toasts, modal dialogs
│   │   │   ├── navigation/         # Headers, sidebars, breadcrumbs
│   │   │   └── ui/                 # Accessible primitives (shadcn-compatible)
│   │   ├── contexts/               # React global contexts
│   │   ├── features/               # Domain-driven feature modules
│   │   │   ├── appointments/       # Slot selection and booking wizards
│   │   │   ├── authentication/     # Sign-in, sign-up, password reset
│   │   │   ├── bookings/           # Booking management views
│   │   │   ├── doctors/            # Doctor schedule and queue control
│   │   │   ├── hospitals/          # Hospital directory & department views
│   │   │   ├── notifications/      # Real-time alert panels
│   │   │   ├── payments/           # Consultation fee payment workflows
│   │   │   └── queue/              # Live queue displays and token trackers
│   │   ├── hooks/                  # Custom React utility hooks
│   │   ├── layouts/                # Structural layout wrappers
│   │   ├── pages/                  # Role-specific routed screen containers
│   │   │   ├── admin/              # Hospital admin portal
│   │   │   ├── auth/               # Authentication screens
│   │   │   ├── doctor/             # Doctor clinical dashboard
│   │   │   ├── patient/            # Patient self-service portal
│   │   │   ├── public/             # Marketing and landing pages
│   │   │   ├── receptionist/       # OPD front-desk console
│   │   │   └── superadmin/         # Platform management portal
│   │   ├── routes/                 # Route declarations & role guards
│   │   ├── services/               # API clients and HTTP abstraction
│   │   ├── styles/                 # Global styling and Tailwind directives
│   │   ├── types/                  # Shared TypeScript interfaces & types
│   │   └── utils/                  # Formatting, date, and math utilities
│   ├── .env.example                # Frontend environment template
│   ├── eslint.config.js            # Flat ESLint configuration
│   ├── index.html                  # HTML5 document template
│   ├── package.json                # Frontend dependencies & scripts
│   ├── postcss.config.js           # PostCSS configuration
│   ├── tailwind.config.js          # Tailwind CSS theme extension
│   ├── tsconfig.json               # TypeScript compiler configuration
│   └── vite.config.ts              # Vite bundler configuration
│
├── docs/                           # Architecture and engineering documentation
│   ├── api/                        # API specifications and contracts
│   ├── architecture/               # System and integration architecture
│   ├── database/                   # Entity relational designs and schemas
│   ├── product-requirements/       # Comprehensive PRD and user flows
│   └── security/                   # Security, compliance, and privacy policies
│
├── infrastructure/                 # Containerization & cloud deployment
│   ├── deployment/                 # Deployment scripts & CI/CD configs
│   └── docker/                     # Dockerfiles & compose manifests
│
├── scripts/                        # Automation & development helper scripts
├── .gitignore                      # Git exclusion rules
└── README.md                       # Project root documentation
```

---

## 4. Getting Started

### Prerequisites

Verify the following tools are installed on your host machine:
- **Node.js:** v18.0.0 or higher (v24.x recommended)
- **Python:** v3.11.0 or higher (v3.13.x recommended)
- **PostgreSQL:** v15.0 or higher (v17.x recommended)
- **Git:** v2.30.0 or higher

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements/local.txt
   ```

4. **Configure environment variables:**
   ```bash
   # Copy template to local .env
   cp .env.example .env
   ```
   *Edit `.env` to configure your PostgreSQL database credentials and secret key.*

5. **Run system checks and verify database:**
   ```bash
   python manage.py check
   ```

6. **Start the Django development server:**
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   *Health Check Endpoint:* `http://127.0.0.1:8000/api/v1/health/`  
   *Interactive OpenAPI Docs:* `http://127.0.0.1:8000/api/docs/`

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Verify TypeScript & Linting:**
   ```bash
   npm run typecheck
   npm run lint
   ```

5. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   *Application will be available at:* `http://localhost:5173/`

---

## 5. Development Workflow & Phase Roadmap

QueueFree is executed across strictly gated engineering phases:

- [x] **Phase 1: Project Foundation & Initial Scaffolding** *(Current)*  
  Establishes modular monorepo directories, complete technical specifications, clean Django DRF backend foundation with health-check and OpenAPI schema, React + Vite + TypeScript frontend scaffolding with Tailwind CSS, and strict environment configuration.
- [ ] **Phase 2: Authentication, Authorization & User Management**  
  JWT token architecture, role-based access control (RBAC), multi-tenant hospital scoping, secure password reset, and session management.
- [ ] **Phase 3: Hospital, Department & Doctor Management**  
  Hospital profile settings, department categorization, doctor consultation schedules, slot quotas, and leave management.
- [ ] **Phase 4: Patient Management & Appointment Scheduling**  
  Patient registration, OPD slot booking, booking verification, cancellation rules, and payment integration.
- [ ] **Phase 5: Intelligent Queue Engine & Live Telemetry**  
  Dynamic token assignment, real-time consultation duration tracking, delay estimation algorithm, priority triage, and walk-in synchronization.
- [ ] **Phase 6: Real-time Communication & Multi-Channel Notifications**  
  Django Channels, Redis pub/sub WebSockets, SMS, WhatsApp, and push notifications.
- [ ] **Phase 7: Production Hardening, Testing & Deployment**  
  End-to-end integration tests, load testing, HIPAA/DISHA audit compliance validation, Docker production builds, and CI/CD pipelines.

---

## 6. Engineering Standards & Documentation

For detailed architectural guidelines and system contracts, consult the documentation suite in `/docs`:
- [System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Product Requirements Document (PRD)](docs/product-requirements/PRODUCT_REQUIREMENTS.md)
- [Database Schema & Design](docs/database/DATABASE_DESIGN.md)
- [API Specification & Contracts](docs/api/API_SPECIFICATION.md)
- [Security & Compliance Policy](docs/security/SECURITY_POLICY.md)
- [Infrastructure & Deployment Guide](infrastructure/README.md)
