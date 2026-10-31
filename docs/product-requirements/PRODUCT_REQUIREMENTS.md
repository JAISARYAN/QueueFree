# QueueFree — Product Requirements Document (PRD)

**Document Version:** 1.0.0-DRAFT  
**Status:** Approved for Foundation Architecture  
**Tagline:** SKIP THE LINE. SAVE YOUR TIME.  
**Supporting Line:** Smarter queues. Faster care. Better healthcare experiences.  

---

## 1. Executive Summary & Product Vision

Outpatient Departments (OPD) in public and private hospitals across developing and developed healthcare markets face acute operational bottlenecks: unpredictable patient arrival rates, severe queue congestion, overcrowded waiting rooms, stressed medical staff, and total lack of visibility into actual consultation wait times. Patients frequently lose half a working day waiting for a 10-minute consultation.

**QueueFree** is an intelligent, multi-tenant OPD appointment scheduling and dynamic queue management platform designed to streamline outpatient flow across multi-hospital networks. By harmonizing pre-booked appointments with on-site walk-ins and calculating rolling consultation velocity, QueueFree enables patients to track live queue progression from home or en route, reducing physical waiting room occupancy by an estimated 60-75% and dramatically improving clinical efficiency.

---

## 2. Product Objectives & Success Metrics

### 2.1 Core Objectives
1. **Queue Elimination:** Provide live queue telemetry and dynamic arrival windows so patients only arrive at the clinic when their consultation is imminent.
2. **Unified Multi-Hospital Ecosystem:** Provide a single portal where patients can discover hospitals, consult specialists, and track queues, while hospitals operate within an isolated, highly secure multi-tenant environment.
3. **Hybrid Flow Harmonization:** Seamlessly balance pre-booked scheduled slots with unexpected walk-in patients and emergency priority cases without causing schedule collapse.
4. **Physician Empowerment:** Give doctors transparent control over their consultation flow, breaks, delays, and daily volume caps.
5. **Operational Intelligence:** Give hospital and clinical administrators real-time data on average wait times, consultation durations, patient no-show rates, and department throughput.

### 2.2 Key Performance Indicators (KPIs)
* **Average In-Clinic Wait Time:** Reduced to < 20 minutes from check-in to consultation.
* **No-Show Rate:** Reduced by > 30% via automated delay notifications and reminders.
* **Waiting Room Density:** Peak waiting hall crowd reduction of > 60%.
* **System Uptime & Responsiveness:** 99.9% uptime with API latency p95 < 150ms.

---

## 3. User Roles, Personas & Permission Matrix

QueueFree operates with five strictly segregated user roles governed by Role-Based Access Control (RBAC):

```
+---------------------------------------------------------------------------------------+
|                                    PLATFORM LEVEL                                     |
|  [Platform Superadministrator] -> Oversees multi-hospital tenants, billing, audits    |
+---------------------------------------------------------------------------------------+
|                                    HOSPITAL LEVEL                                     |
|  [Hospital Administrator]     -> Configures departments, doctor quotas, facility ops  |
|  [Receptionist / OPD Staff]   -> Patient check-in, token issuance, triage & queue     |
|  [Doctor / Clinician]         -> Schedule management, call next token, consultation   |
+---------------------------------------------------------------------------------------+
|                                     PATIENT LEVEL                                     |
|  [Patient / Guardian]         -> Search, booking, queue tracking, notifications       |
+---------------------------------------------------------------------------------------+
```

### 3.1 Patient
* **Profile:** Self-service individuals or caregivers booking OPD consultations for themselves or family dependents.
* **Core Capabilities:**
  - Discover hospitals by geography, specialty, doctor, or available slots.
  - Book advance appointments with slot selection.
  - View live token position, estimated consultation time, and doctor delays.
  - Cancel or reschedule appointments in accordance with facility policies.
  - Access appointment history, digital token passes, and consultation receipts.

### 3.2 Doctor (Clinician)
* **Profile:** Medical professionals conducting outpatient clinics.
* **Core Capabilities:**
  - View daily schedule, appointment list, and active queue status.
  - Mark session start, pause session (e.g. for emergency rounds), and conclude clinic.
  - Call next patient token, mark patient as "In Consultation", "Completed", or "No-Show".
  - Flag priority cases (e.g., triage escalations).
  - Configure recurring availability rules and maximum daily consultation capacities.

### 3.3 Receptionist / OPD Front-Desk Staff
* **Profile:** Hospital intake operators managing physical arrival desks.
* **Core Capabilities:**
  - Scan digital QR codes or verify phone numbers to check in pre-booked patients.
  - Register walk-in patients and issue physical/digital queue tokens.
  - Adjust queue positions for emergency/geriatric triage.
  - Re-queue late arrivals according to predefined hospital grace period rules.
  - Collect or verify on-premise consultation fees.

### 3.4 Hospital Administrator
* **Profile:** Clinical directors and operations managers of a specific hospital facility.
* **Core Capabilities:**
  - Configure hospital metadata, branches, departments, and consultation rooms.
  - Manage doctor profiles, department assignments, and working shift templates.
  - Establish hospital-wide queue buffer times, walk-in quotas, and grace periods.
  - Access real-time OPD analytics, doctor throughput reports, and delay heatmaps.
  - Audit staff activity and patient logs within their hospital tenant boundary.

### 3.5 Platform Superadministrator
* **Profile:** QueueFree internal operations and compliance engineering team.
* **Core Capabilities:**
  - Onboard new hospital organizations and manage enterprise tenant subscriptions.
  - Monitor global system health, API gateway throughput, and error rates.
  - Manage global security policies, audit logs, and compliance records.
  - Configure system-wide feature flags and integration gateways (SMS, WhatsApp, Payments).

---

## 4. Functional Scope & Module Breakdown

### Module 1: Hospital & Department Hierarchy
* Multi-tenant structure: Hospital Organization -> Facility Branch -> Department -> Clinic Room.
* Specialties classification (Cardiology, Orthopedics, Pediatrics, General Medicine, etc.).

### Module 2: Doctor Schedule & Capacity Planning
* Dynamic shift definition (Morning OPD, Evening OPD, Special Clinics).
* Slot generation engine: Fixed-interval slots (e.g., 15-minute slots) vs. block-arrival quota windows.
* Quota segregation: Reserved slots for online bookings vs. walk-in allocations.

### Module 3: Patient Booking & Slot Allocation
* Search & filtering engine (by city, specialty, doctor, date, earliest available).
* Conflict prevention: Atomic database row-level locking on time slots to prevent double-booking under high concurrency.
* Dependent management: One patient account can manage profiles for family members.

### Module 4: Dynamic Queue Sequencing & Token Engine
* Token generation schema: Prefixed alphanumeric tokens (e.g., `CARD-014` or `B1-022`).
* Hybrid interleaving algorithm: Configurable ratio interleaving (e.g., 2 online booked patients to 1 walk-in patient).
* Real-time queue state transitions:
  `BOOKED` -> `CHECKED_IN` -> `WAITING` -> `CALLED` -> `IN_CONSULTATION` -> `COMPLETED` (or `NO_SHOW` / `CANCELLED` / `DEFERRED`).

### Module 5: Real-time Telemetry & Dynamic Delay Calculation
* Dynamic ETA algorithm:
  $$\text{ETA} = \text{Current Time} + (\text{Tokens Ahead} \times \text{Rolling Average Consultation Duration}) + \text{Doctor Buffer Delay}$$
* Doctor break / emergency pause propagation: Immediate notification to all downstream waiting tokens.

### Module 6: Notification & Alert Dispatcher
* Multi-channel dispatch: SMS, WhatsApp, Email, and Push Notifications.
* Proximity triggers:
  1. On booking confirmation.
  2. T-24 hours and T-2 hours reminder.
  3. When token is "3 positions away" (instruction to proceed to clinic door).
  4. Immediate alert if doctor reports delay > 30 minutes.

### Module 7: Audit Logging & Regulatory Compliance
* Complete tamper-evident audit trail capturing every state transition, user login, token call, and record modification.
* Role-based data redaction to preserve Patient Health Information (PHI) privacy.

---

## 5. Hospital Integration Models

QueueFree is engineered to support hospitals with widely varying technological capabilities:

```
+---------------------------------------------------------------------------------+
|                         HOSPITAL INTEGRATION MODELS                             |
+---------------------------------------------------------------------------------+
| Model A: Standalone Cloud SaaS                                                  |
| - For hospitals without existing HMS/EMR.                                       |
| - Full lifecycle (registration, scheduling, queueing, billing) handled directly |
|   in QueueFree web consoles.                                                    |
+---------------------------------------------------------------------------------+
| Model B: Hybrid API Gateway                                                     |
| - For modern hospitals with existing REST/JSON based hospital software.         |
| - Bi-directional webhooks sync doctor rosters, appointments, and token status.  |
+---------------------------------------------------------------------------------+
| Model C: Enterprise On-Premise Connector                                        |
| - For legacy tertiary care centers utilizing HL7 v2, FHIR, or on-prem databases.|
| - Lightweight on-premise sync agent pushes/pulls roster and queue snapshots     |
|   over mutual-TLS (mTLS).                                                       |
+---------------------------------------------------------------------------------+
```

---

## 6. Open Decisions & Product Architectural RFCs

The following business rules and architectural questions are intentionally flagged as **OPEN DECISIONS** and must not be assumed finalized until explicit stakeholder sign-off:

1. **Open Decision 1: Token Interleaving Policy**  
   *Options:*
   - *Option A:* Strict chronological arrival interleaving regardless of booking source.
   - *Option B:* Deterministic ratio (e.g. 2 scheduled : 1 walk-in).
   - *Option C:* Time-slot priority windows (booked patients retain absolute priority during their scheduled 30-minute block; walk-ins fill gaps).  
   *Current Status:* Open. Defaulting to configurable policy per hospital tenant in Phase 5.

2. **Open Decision 2: Late Arrival / Grace Period Handling**  
   *Options:*
   - *Option A:* Automatic forfeiture of token after 15 minutes of being called; patient must re-register as walk-in.
   - *Option B:* Deferred insertion (pushed back by $N$ slots, e.g. 3 positions behind current token).  
   *Current Status:* Open.

3. **Open Decision 3: Consultation Fee Collection Point**  
   *Options:*
   - Mandatory upfront online payment at time of booking.
   - Optional online payment with front-desk cash/card settlement option upon check-in.
   - Free booking with full payment collected at hospital reception.  
   *Current Status:* Open. Architecture must support both pre-paid and post-paid booking states.

4. **Open Decision 4: Multi-Tenant Data Isolation Strategy**  
   *Options:*
   - *Option A (Selected for MVP):* Shared database, shared schema with mandatory tenant discriminator (`hospital_id`) on all clinical records and PostgreSQL Row-Level Security (RLS) enforcement.
   - *Option B:* Separate database schema per hospital.  
   *Current Status:* Shared schema with strict tenant-scoping adopted for Phase 1.
