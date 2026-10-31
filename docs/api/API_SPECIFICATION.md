# QueueFree — API Specification & Integration Contracts

**API Version:** `v1` (`/api/v1/`)  
**Specification Standard:** OpenAPI 3.0.3 (via `drf-spectacular`)  
**Data Interchange Format:** JSON (`application/json; charset=utf-8`)  
**Status:** Approved Reference Specification  

---

## 1. Architectural Strategy & Design Conventions

The QueueFree REST API provides a predictable, standardized, versioned interface connecting web clients, hospital front-desks, and external integration connectors to the Django backend.

### 1.1 Fundamental Principles
1. **URI Versioning:** All endpoints are scoped under `/api/v1/`. Breaking changes will increment the URI prefix to `/api/v2/`.
2. **HTTP Verb Semantics:**
   - `GET`: Read resource representations without side-effects.
   - `POST`: Create new resources or trigger domain commands (e.g. `call-next`).
   - `PUT`: Complete idempotent resource replacement.
   - `PATCH`: Partial resource updates.
   - `DELETE`: Resource removal or soft-delete flag mutation.
3. **HTTP Status Code Discipline:**
   - `200 OK`: Successful read or update.
   - `201 Created`: Resource successfully created.
   - `204 No Content`: Successful mutation with empty body.
   - `400 Bad Request`: Payload validation error or malformed input.
   - `401 Unauthorized`: Missing, expired, or invalid JWT authentication token.
   - `403 Forbidden`: Authenticated user lacks permission to access or mutate resource.
   - `404 Not Found`: Target resource does not exist or is hidden by tenant scoping.
   - `409 Conflict`: Concurrency conflict (e.g. slot already reserved or token collision).
   - `429 Too Many Requests`: Client exceeded rate limit throttle.
   - `500 Internal Server Error`: Unhandled server exception (logged with trace ID).

---

## 2. Authentication & Authorization Contracts

QueueFree uses a stateless **JSON Web Token (JWT)** architecture:

### 2.1 Header Standard
Clients must transmit the access token in the `Authorization` request header:
```http
Authorization: Bearer <access_token>
```

### 2.2 JWT Token Lifecycle
* **Access Token:** Short-lived (15 minutes). Contains minimal claims:
  ```json
  {
    "user_id": "a9e63c0a-0c7f-4c12-8e6d-625d97bc5f8b",
    "email": "doctor.sharma@apollo.org",
    "role": "DOCTOR",
    "hospital_id": "7f8b9e12-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
    "exp": 1793442600,
    "iat": 1793441700
  }
  ```
* **Refresh Token:** Long-lived (7 days). Stored in secure `HttpOnly; SameSite=Strict; Secure` cookie or local storage, used solely at `/api/v1/auth/token/refresh/` to obtain a fresh access token. Refresh token rotation is enforced to mitigate token replay attacks.

---

## 3. Standard Response & Error Envelopes

### 3.1 Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Resource retrieved successfully.",
  "meta": {
    "timestamp": "2026-10-31T08:35:00.123Z",
    "request_id": "req_01h9a8b7c6d5e4f3"
  }
}
```

### 3.2 Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more input fields were invalid.",
    "details": [
      {
        "field": "slot_id",
        "issue": "This appointment slot has already been reserved."
      }
    ]
  },
  "meta": {
    "timestamp": "2026-10-31T08:35:00.123Z",
    "request_id": "req_01h9a8b7c6d5e4f3"
  }
}
```

---

## 4. Primary API Route Registry (Phase 1 Baseline)

### 4.1 System & Observability
* `GET /api/v1/health/`  
  *Access:* Public  
  *Response:* `200 OK` with backend service health status, PostgreSQL database connectivity indicator, API version, and server timestamp.
* `GET /api/schema/`  
  *Access:* Public / Staff  
  *Response:* OpenAPI 3.0 YAML/JSON specification.
* `GET /api/docs/`  
  *Access:* Public / Staff  
  *Response:* Swagger UI interactive documentation.

### 4.2 Authentication Endpoints (Scheduled for Phase 2)
* `POST /api/v1/auth/register/` — Patient registration.
* `POST /api/v1/auth/login/` — Issue JWT access and refresh token pair.
* `POST /api/v1/auth/token/refresh/` — Rotate refresh token and issue new access token.
* `GET  /api/v1/auth/me/` — Retrieve authenticated user profile and roles.

### 4.3 Hospitals & Clinical Directory (Scheduled for Phase 3)
* `GET  /api/v1/hospitals/` — Filterable hospital directory (city, specialty, query).
* `GET  /api/v1/hospitals/{id}/` — Hospital detail and departmental catalog.
* `GET  /api/v1/doctors/` — Doctor directory with specialty and hospital filters.
* `GET  /api/v1/doctors/{id}/availability/` — Available consultation dates and shifts.

### 4.4 Appointments & Slot Booking (Scheduled for Phase 4)
* `GET  /api/v1/doctors/{id}/slots/?date=YYYY-MM-DD` — Real-time list of available time slots.
* `POST /api/v1/bookings/reserve/` — Reserve a slot with temporary hold TTL.
* `POST /api/v1/bookings/{id}/confirm/` — Finalize booking and issue confirmation code.
* `POST /api/v1/bookings/{id}/cancel/` — Cancel appointment according to hospital policy.

### 4.5 Queue Telemetry & Operations (Scheduled for Phase 5)
* `GET  /api/v1/queue/live/?doctor_id={id}&date={date}` — Public/patient live queue status (current token, waiting count, rolling estimated delay).
* `POST /api/v1/queue/tokens/check-in/` — Receptionist check-in converting booking to active waiting token.
* `POST /api/v1/queue/tokens/walk-in/` — Issue a new walk-in token at reception.
* `POST /api/v1/queue/sessions/{id}/call-next/` — Doctor calls the next token in sequence.
* `POST /api/v1/queue/sessions/{id}/report-delay/` — Doctor reports a clinic delay in minutes.
