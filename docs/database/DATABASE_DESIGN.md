# QueueFree — Database Design Specification

**Target Database Management System:** PostgreSQL 17+  
**Architecture Model:** Relational Multi-Tenant Shared Schema with Tenant Foreign Keys & Row-Level Isolation  
**Version:** 1.0.0-PHASE-1  

---

## 1. Database Design Principles

1. **Relational Integrity & ACID Compliance:** All relational linkages enforce explicit foreign key constraints with strict referential integrity (`ON DELETE RESTRICT` or `ON DELETE CASCADE` where cascading ownership is unequivocal).
2. **Primary Key Strategy:**
   - **UUIDv4 (`uuid_generate_v4()` / Django `UUIDField`):** Used on all externally-exposed entities (Users, Hospitals, Appointments, Tokens, Bookings) to mitigate sequential enumeration vulnerabilities and avoid predictable URL references.
   - **BigAutoInt (`bigserial`):** Permitted internally for append-only, high-throughput log tables (Audit Logs, Notification Dispatches) for optimal index packing.
3. **Auditability & Traceability:** All tables inherit from a base `TimeStampedModel` containing `created_at` (UTC) and `updated_at` (UTC). Critical clinical and financial models additionally record `created_by_id` and `updated_by_id`.
4. **Soft Deletion:** Soft deletion (`is_deleted`, `deleted_at`) is mandated on critical business entities (Users, Doctors, Hospitals, Departments, Appointments) to prevent accidental loss of historical clinical and administrative context.
5. **Multi-Tenant Scoping:** All clinical, doctor, schedule, queue, and appointment tables contain an explicit `hospital_id` foreign key.

---

## 2. Conceptual Entity Relationship (ER) Model

```
+-------------------+           +-----------------------+
|     Hospital      | 1       * |      Department       |
| (Tenant Profile)  +-----------+ (Clinical Specialty)  |
+---------+---------+           +-----------+-----------+
          | 1                               | 1
          |                                 |
          | *                               | *
+---------v---------+           +-----------v-----------+
|    User / Auth    | 1       * |    Doctor Profile     |
| (RBAC & Identity) +-----------+ (Schedules & Shifts)  |
+---------+---------+           +-----------+-----------+
          | 1                               | 1
          |                                 |
          | *                               | *
+---------v---------+           +-----------v-----------+
|  Patient Profile  | 1       * |   Appointment Slot    |
| (Demographics)    +-----------+ (Atomic Time Windows) |
+---------+---------+           +-----------+-----------+
          | 1                               | 1
          |                                 |
          | *                               | *
+---------v---------------------------------v-----------+
|                       Booking                         |
|   (Patient Appointment Orchestrator & Payment Ref)    |
+---------------------------+---------------------------+
                            | 1
                            |
                            | 1 (or 0..1 for Walk-in)
+---------------------------v---------------------------+
|                     Queue Token                       |
|   (Token Number, State, Position, Estimated Call)     |
+---------------------------+---------------------------+
                            | 1
                            |
                            | *
+---------------------------v---------------------------+
|                 Queue State Transition                |
| (Audit Record of Waiting -> Called -> Completed, etc.)|
+-------------------------------------------------------+
```

---

## 3. Core Entity Schemas & Attributes

### 3.1 Domain: Accounts (`backend/apps/accounts`)
* **`users` Table:**
  - `id`: UUID (Primary Key)
  - `email`: VARCHAR(255) (Unique, Indexed)
  - `phone_number`: VARCHAR(20) (Indexed)
  - `password_hash`: VARCHAR(255)
  - `first_name`: VARCHAR(100), `last_name`: VARCHAR(100)
  - `role`: VARCHAR(30) (ENUM: `PATIENT`, `DOCTOR`, `RECEPTIONIST`, `HOSPITAL_ADMIN`, `SUPERADMIN`)
  - `hospital_id`: UUID (FK -> `hospitals.id`, NULL for Patients and Superadmins)
  - `is_active`: BOOLEAN (Default: TRUE)
  - `is_staff`: BOOLEAN (Default: FALSE)
  - `created_at`, `updated_at`: TIMESTAMPTZ

### 3.2 Domain: Hospitals & Facilities (`backend/apps/hospitals`)
* **`hospitals` Table:**
  - `id`: UUID (Primary Key)
  - `name`: VARCHAR(255) (Indexed)
  - `code`: VARCHAR(50) (Unique identifier slug, e.g., `APOLLO-DELHI`)
  - `address_line1`, `address_line2`: VARCHAR(255)
  - `city`: VARCHAR(100) (Indexed), `state`: VARCHAR(100), `postal_code`: VARCHAR(20), `country`: VARCHAR(50)
  - `contact_email`: VARCHAR(255), `contact_phone`: VARCHAR(20)
  - `settings`: JSONB (Operating hours, queue buffer times, grace period in minutes, walk-in allocation rules)
  - `is_active`: BOOLEAN (Default: TRUE)
  - `created_at`, `updated_at`: TIMESTAMPTZ

### 3.3 Domain: Departments (`backend/apps/departments`)
* **`departments` Table:**
  - `id`: UUID (Primary Key)
  - `hospital_id`: UUID (FK -> `hospitals.id`, ON DELETE CASCADE)
  - `name`: VARCHAR(150) (e.g., Cardiology, General Medicine)
  - `code`: VARCHAR(50) (e.g., `CARD`, `GEN`)
  - `floor_location`: VARCHAR(100)
  - `is_active`: BOOLEAN (Default: TRUE)
  - Unique Constraint: `(hospital_id, code)`

### 3.4 Domain: Doctors & Schedules (`backend/apps/doctors`)
* **`doctors` Table:**
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (FK -> `users.id`, ON DELETE RESTRICT)
  - `hospital_id`: UUID (FK -> `hospitals.id`, ON DELETE CASCADE)
  - `department_id`: UUID (FK -> `departments.id`, ON DELETE RESTRICT)
  - `license_number`: VARCHAR(100) (Unique per regulatory jurisdiction)
  - `specialization`: VARCHAR(255)
  - `default_consultation_minutes`: INTEGER (Default: 15)
  - `max_daily_patients`: INTEGER (Default: 40)
  - `room_number`: VARCHAR(50)
  - `is_available_for_teleconsult`: BOOLEAN (Default: FALSE)
  - `is_active`: BOOLEAN (Default: TRUE)

* **`doctor_shifts` Table:**
  - `id`: UUID (Primary Key)
  - `doctor_id`: UUID (FK -> `doctors.id`, ON DELETE CASCADE)
  - `day_of_week`: SMALLINT (0=Monday ... 6=Sunday)
  - `start_time`: TIME, `end_time`: TIME
  - `max_online_slots`: INTEGER, `max_walkin_slots`: INTEGER
  - `is_active`: BOOLEAN (Default: TRUE)

### 3.5 Domain: Patients (`backend/apps/patients`)
* **`patients` Table:**
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (FK -> `users.id`, ON DELETE SET NULL, NULL for unregistered walk-ins)
  - `hospital_id`: UUID (FK -> `hospitals.id`, optional primary hospital)
  - `uhid`: VARCHAR(100) (Unique Hospital Identification, optional per hospital)
  - `date_of_birth`: DATE
  - `gender`: VARCHAR(20) (MALE, FEMALE, OTHER, UNDISCLOSED)
  - `blood_group`: VARCHAR(10)
  - `emergency_contact_name`: VARCHAR(100), `emergency_contact_phone`: VARCHAR(20)
  - `is_active`: BOOLEAN (Default: TRUE)

### 3.6 Domain: Appointments & Slots (`backend/apps/appointments`)
* **`appointment_slots` Table:**
  - `id`: UUID (Primary Key)
  - `doctor_id`: UUID (FK -> `doctors.id`, ON DELETE CASCADE)
  - `hospital_id`: UUID (FK -> `hospitals.id`, ON DELETE CASCADE)
  - `slot_date`: DATE (Indexed)
  - `start_time`: TIME, `end_time`: TIME
  - `slot_type`: VARCHAR(20) (ONLINE, WALKIN_BUFFER, VIP_EMERGENCY)
  - `is_booked`: BOOLEAN (Default: FALSE, Indexed)
  - `version`: INTEGER (Optimistic locking counter)
  - Unique Constraint: `(doctor_id, slot_date, start_time)`

### 3.7 Domain: Bookings (`backend/apps/bookings`)
* **`bookings` Table:**
  - `id`: UUID (Primary Key)
  - `booking_reference`: VARCHAR(30) (Unique, e.g., `BK-20261031-9872`)
  - `slot_id`: UUID (FK -> `appointment_slots.id`, ON DELETE RESTRICT)
  - `patient_id`: UUID (FK -> `patients.id`, ON DELETE RESTRICT)
  - `doctor_id`: UUID (FK -> `doctors.id`, ON DELETE RESTRICT)
  - `hospital_id`: UUID (FK -> `hospitals.id`, ON DELETE RESTRICT)
  - `status`: VARCHAR(30) (PENDING_PAYMENT, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)
  - `payment_status`: VARCHAR(30) (UNPAID, PAID, REFUNDED, EXEMPT)
  - `cancellation_reason`: TEXT (Nullable)
  - `created_at`, `updated_at`: TIMESTAMPTZ

### 3.8 Domain: Queue Management (`backend/apps/queue_management`)
* **`queue_sessions` Table:**
  - `id`: UUID (Primary Key)
  - `doctor_id`: UUID (FK -> `doctors.id`, ON DELETE CASCADE)
  - `hospital_id`: UUID (FK -> `hospitals.id`, ON DELETE CASCADE)
  - `session_date`: DATE (Indexed)
  - `session_type`: VARCHAR(30) (MORNING_OPD, EVENING_OPD)
  - `status`: VARCHAR(30) (SCHEDULED, IN_PROGRESS, PAUSED, CONCLUDED)
  - `current_token_number`: INTEGER (Default: 0)
  - `delay_minutes`: INTEGER (Doctor reported delay, Default: 0)
  - Unique Constraint: `(doctor_id, session_date, session_type)`

* **`queue_tokens` Table:**
  - `id`: UUID (Primary Key)
  - `queue_session_id`: UUID (FK -> `queue_sessions.id`, ON DELETE CASCADE)
  - `booking_id`: UUID (FK -> `bookings.id`, Nullable for walk-ins)
  - `patient_id`: UUID (FK -> `patients.id`, ON DELETE RESTRICT)
  - `token_display`: VARCHAR(20) (e.g., `CARD-012`, Indexed)
  - `sequence_number`: INTEGER (Numeric queue ordering)
  - `token_type`: VARCHAR(20) (SCHEDULED, WALK_IN, EMERGENCY_TRIAGE)
  - `state`: VARCHAR(30) (`ISSUED`, `CHECKED_IN`, `WAITING`, `CALLED`, `IN_CONSULTATION`, `COMPLETED`, `NO_SHOW`, `CANCELLED`)
  - `estimated_call_time`: TIMESTAMPTZ
  - `actual_call_time`: TIMESTAMPTZ
  - `consultation_start_time`: TIMESTAMPTZ
  - `consultation_end_time`: TIMESTAMPTZ
  - `created_at`: TIMESTAMPTZ

### 3.9 Domain: Audit Logs (`backend/apps/audit_logs`)
* **`audit_logs` Table:**
  - `id`: BIGSERIAL (Primary Key)
  - `event_id`: UUID (Indexed)
  - `actor_id`: UUID (FK -> `users.id`, Nullable for anonymous attempts)
  - `hospital_id`: UUID (FK -> `hospitals.id`, Nullable)
  - `action`: VARCHAR(100) (e.g., `BOOKING_CREATED`, `TOKEN_CALLED`, `DOCTOR_DELAY_REPORTED`)
  - `target_model`: VARCHAR(100)
  - `target_id`: VARCHAR(100)
  - `ip_address`: INET
  - `user_agent`: TEXT
  - `changes`: JSONB (Before and After payload diff)
  - `timestamp`: TIMESTAMPTZ (Default: `NOW()`, Indexed)

---

## 4. Concurrency & Slot Reservation Strategy

During high-demand OPD slot release, hundreds of patients may attempt to reserve the same doctor slot simultaneously. To guarantee zero double-bookings:

1. **Pessimistic Row-Level Lock:**
   Slot booking transactions execute inside an atomic block using PostgreSQL `FOR UPDATE`:
   ```python
   with transaction.atomic():
       slot = AppointmentSlot.objects.select_for_update().get(id=slot_id, is_booked=False)
       slot.is_booked = True
       slot.save()
       booking = Booking.objects.create(slot=slot, ...)
   ```
2. **Short Reservation Hold TTL:**
   When a user enters the checkout flow, the slot enters `RESERVED` status with a 10-minute expiry time (`expires_at`). An automated periodic worker or lazy-check frees expired reservations.

---

## 5. Indexing Strategy for High-Throughput OPD Telemetry

* **Slot Search Index:** `CREATE INDEX idx_slots_search ON appointment_slots (doctor_id, slot_date, is_booked);`
* **Live Queue Progress Index:** `CREATE INDEX idx_queue_tokens_active ON queue_tokens (queue_session_id, state, sequence_number);`
* **Tenant Isolation Index:** `CREATE INDEX idx_hospital_tenant_lookup ON bookings (hospital_id, created_at DESC);`
* **Audit Range Index:** `CREATE INDEX idx_audit_time ON audit_logs (hospital_id, timestamp DESC);`
