# QueueFree — System Architecture Specification

**Architecture Style:** Modular Monolith with Decoupled Frontend Single-Page Application  
**Version:** 1.0.0-PHASE-1  
**Status:** Approved Reference Architecture  

---

## 1. Architectural Principles & Overview

QueueFree is engineered around a **modular monolithic backend** paired with a **decoupled React single-page frontend application (SPA)**. This pattern maximizes development velocity, ensures transactional data consistency across hospital domains, prevents premature distributed-systems overhead (microservices anti-patterns), and guarantees strict encapsulation of business domains.

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT LAYER                                       |
|  React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion                          |
|  - Patient Portal    - Doctor Console    - Receptionist Desk    - Admin Dashboards    |
+-------------------------------------------+-------------------------------------------+
                                            |
                                HTTPS / TLS 1.3
                                RESTful JSON API
                                (Future: WSS / WebSockets)
                                            |
+-------------------------------------------v-------------------------------------------+
|                                  API GATEWAY / REVERSE PROXY                          |
|  Nginx / Cloud Load Balancer (SSL Termination, Rate Limiting, Static Asset Cache)     |
+-------------------------------------------+-------------------------------------------+
                                            |
+-------------------------------------------v-------------------------------------------+
|                           BACKEND LAYER (DJANGO 5.1 + DRF)                            |
|                                                                                       |
|  +-------------------+  +-------------------+  +-------------------+                  |
|  |   accounts        |  |   hospitals       |  |   departments     |                  |
|  |   (Auth & RBAC)   |  |   (Tenant Core)   |  |   (Specialties)   |                  |
|  +-------------------+  +-------------------+  +-------------------+                  |
|  +-------------------+  +-------------------+  +-------------------+                  |
|  |   doctors         |  |   patients        |  |   appointments    |                  |
|  |   (Rosters & Caps)|  |   (Profiles & EMR)|  |   (Slots & Locks) |                  |
|  +-------------------+  +-------------------+  +-------------------+                  |
|  +-------------------+  +-------------------+  +-------------------+                  |
|  |   queue_management|  |   notifications   |  |   audit_logs      |                  |
|  |   (Tokens & State)|  |   (SMS / WhatsApp)|  |   (Tamper-Evident)|                  |
|  +-------------------+  +-------------------+  +-------------------+                  |
|  +-------------------+  +-------------------+  +-------------------+                  |
|  |   payments        |  |   integrations    |  |   core            |                  |
|  |   (Invoices)      |  |   (HL7 / FHIR)    |  |   (Base & Health) |                  |
|  +-------------------+  +-------------------+  +-------------------+                  |
+-------------------------------------------+-------------------------------------------+
                                            |
                       +--------------------+--------------------+
                       |                                         |
                       v                                         v
+-------------------------------------------+ +-----------------------------------------+
|             PERSISTENCE LAYER             | |        FUTURE REAL-TIME BROKER          |
|  PostgreSQL 17+ (Relational Database)     | |  Redis (In-Memory Key-Value & Pub/Sub)  |
|  - ACID Transactions, Row-Level Locking   | |  - Channel Layers for WebSockets        |
|  - Strict Foreign Keys, Audit Tables      | |  - Celery Task Queue & Transient Cache  |
+-------------------------------------------+ +-----------------------------------------+
```

---

## 2. Frontend Architecture & Responsibilities

The frontend is a single-page web application written in **TypeScript** using **React 19** and bundled with **Vite**.

### 2.1 Core Responsibilities
1. **Presentation & State:** Render dynamic, accessible, and responsive user interfaces tailored to each stakeholder role.
2. **Client-Side Routing & Navigation:** Enforce route-level authorization guards preventing unauthorized view transitions.
3. **Data Fetching & Cache Management:** Manage network requests, optimistic UI updates, and token lifecycle handling.
4. **Telemetry Visualization:** Render live queue positions, doctor delay indicators, and countdown timers.
5. **No Direct Database Access:** Never communicate directly with the database or third-party credentialed services; all state queries and mutations flow through the Django REST API.

### 2.2 Directory & Structural Pattern
The frontend employs a **feature-based architecture**, where application logic is grouped by domain rather than purely by technical type:
- `src/features/<feature_name>/`: Contains feature-specific components, hooks, services, and types (e.g. `appointments`, `queue`, `authentication`).
- `src/components/`: Reusable, domain-agnostic UI primitives (`ui/`, `common/`, `feedback/`, `navigation/`).
- `src/layouts/`: Structural frame layouts (e.g., `RootLayout`, `DashboardLayout`, `AuthLayout`).
- `src/pages/`: Routed page entry points organized by user role (`patient/`, `doctor/`, `receptionist/`, `admin/`, `public/`).
- `src/services/api/`: Centralized HTTP client configurations, interceptors, and typed API response envelopes.

---

## 3. Backend Architecture & Responsibilities

The backend is built with **Python 3.13** and **Django 5.1 / Django REST Framework (DRF)**.

### 3.1 Core Responsibilities
1. **Business Logic Enforcement:** Validate slot availability, token generation sequences, queue state transitions, and cancellation rules.
2. **Data Integrity & Concurrency Control:** Manage database transactions using PostgreSQL ACID guarantees and row-level locks (`select_for_update()`) to prevent race conditions during slot booking.
3. **Multi-Tenant Isolation:** Ensure that hospital staff can only inspect and mutate records belonging to their assigned hospital organization.
4. **Authentication & Authorization:** Verify JWT signatures, validate user roles and permissions, and enforce object-level permission checks.
5. **Audit Logging:** Immutably record all administrative, clinical, and security actions with actor timestamps and client IP addresses.

### 3.2 Modular Monolith Domain Boundaries
To maintain high modularity, each Django application inside `backend/apps/` encapsulates a specific business domain:
* `core`: Shared base abstract models (`TimeStampedModel`, `UUIDModel`), standard error handlers, and system health checks.
* `accounts`: Custom User model, role definitions (`UserRole`), profile details, and auth endpoints.
* `hospitals`: Hospital organization profile, operating branches, facilities, and tenant configurations.
* `departments`: Clinical departments (e.g., Cardiology, ENT) and clinic room mappings.
* `doctors`: Physician profiles, departmental linkages, consultation duration defaults, and daily caps.
* `patients`: Patient demographics, emergency contacts, and medical record linkages.
* `appointments`: Time-slot definition, slot generation templates, and booked appointments.
* `bookings`: Patient-facing booking orchestrator tying patient, doctor, slot, and payment intent.
* `queue_management`: Dynamic token generation, queue state machines, and real-time wait telemetry.
* `notifications`: Multi-channel notification templates, dispatch records, and webhook callbacks.
* `payments`: Fee structures, transaction status tracking, and receipt generation.
* `integrations`: External Hospital Management System (HMS), EHR, and HL7/FHIR connectors.
* `audit_logs`: Tamper-evident operational event logs for compliance.

---

## 4. Communication Strategy & Data Contracts

### 4.1 REST API Design Standards
* **Protocol:** HTTPS with TLS 1.3.
* **Format:** JSON payloads with standard UTF-8 encoding.
* **URL Versioning:** All endpoints are explicitly prefixed with `/api/v1/` to ensure non-breaking API evolution.
* **Idempotency:** State-mutating operations (such as token check-in and booking confirmation) accept an `Idempotency-Key` header to protect against network retries.

### 4.2 Standard API Response Envelope
To ensure client predictability, all endpoints adhere to a standard envelope structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully.",
  "meta": {
    "timestamp": "2026-10-31T08:30:00Z",
    "request_id": "req_01h9..."
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "SLOT_ALREADY_RESERVED",
    "message": "The selected appointment slot has already been claimed.",
    "details": []
  },
  "meta": {
    "timestamp": "2026-10-31T08:30:00Z",
    "request_id": "req_01h9..."
  }
}
```

---

## 5. Future Real-Time Architecture (Django Channels & Redis)

In Phase 5 & 6, real-time queue synchronization will be introduced without disrupting the underlying REST API:

```
[Browser Client] <--- WebSocket (WSS) ---> [ASGI Server: Daphne / Uvicorn]
                                                   |
                                            [Channel Layer]
                                                   |
                                            [Redis Pub/Sub]
                                                   ^
                                                   |
[Doctor Console: "Next Patient"] ---> [DRF API POST /api/v1/queue/call-next/]
                                                   |
                                     (Emits QueueUpdatedEvent to Redis)
```

1. **Protocol:** Secure WebSockets (`wss://`).
2. **Channel Grouping:** Scoped by doctor/clinic queue session: `group_queue_hospital_{hospital_id}_doctor_{doctor_id}_{date}`.
3. **Payload Efficiency:** WebSocket frames emit lightweight differential state updates (e.g., current token number, tokens waiting, estimated delay in minutes), prompting clients to refresh or directly render updated counters.

---

## 6. Resilience, Caching & Performance

1. **Database Indexing:** Composite indices on `(hospital_id, department_id)`, `(doctor_id, appointment_date, status)`, and `(queue_session_id, sequence_number)`.
2. **Connection Pooling:** PgBouncer or native Django 5.1 connection persistence (`CONN_MAX_AGE`) to minimize connection handshake latency.
3. **Rate Limiting:** DRF throttles (`AnonRateThrottle`, `UserRateThrottle`) to protect public endpoints (slot search, login) against denial-of-service and credential stuffing.
4. **Graceful Degradation:** If real-time WebSockets fail, client SPAs fall back to short-interval exponential polling over standard REST endpoints.
