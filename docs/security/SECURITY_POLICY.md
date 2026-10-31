# QueueFree — Security & Compliance Policy

**Security Classification:** Enterprise Healthcare Confidential  
**Compliance Alignment:** HIPAA Security Rule, DISHA (India Digital Information Security in Healthcare Act), GDPR Principles  
**Version:** 1.0.0-PHASE-1  

---

## 1. Security Architecture & Threat Model

QueueFree processes sensitive demographic and clinical workflow data. Protecting patient confidentiality, ensuring record integrity, and guaranteeing system availability are paramount engineering obligations.

### 1.1 Threat Surface Analysis
* **Unauthorized Cross-Tenant Access:** An operator or doctor at Hospital A attempting to read or manipulate records belonging to Hospital B.
  - *Mitigation:* Multi-tenant query filtering enforced at the Django ORM and ViewSet layer, backed by PostgreSQL Row-Level Security (RLS).
* **Slot Hoarding & Denial of Service:** Malicious automated bots reserving large blocks of OPD slots.
  - *Mitigation:* IP and account rate throttling (DRF throttles), CAPTCHA verification on public slot reservations, and short reservation expiry time-to-live (TTL).
* **Credential Stuffing & Brute Force:** Automated attacks targeting administrative or doctor logins.
  - *Mitigation:* Exponential backoff on failed logins, account lockouts after 5 consecutive failures, and strong password complexity policies.
* **Tampering with Queue Order:** Insider attempts to bypass queue sequences for favored patients.
  - *Mitigation:* Cryptographically verifiable queue sequencing and immutable append-only audit logging for every token reordering action.

---

## 2. Data Protection in Transit and at Rest

### 2.1 Encryption in Transit
* **Mandatory TLS 1.3 / 1.2:** All HTTP traffic is terminated over HTTPS with modern cipher suites. Insecure HTTP is redirected to HTTPS at the reverse proxy.
* **HSTS (HTTP Strict Transport Security):** Enforced with `max-age=31536000; includeSubDomains; preload`.
* **Internal Network Encryption:** Traffic between reverse proxies, Django application servers, and PostgreSQL instances in production must traverse encrypted VPC networks or SSL-encrypted database connections (`sslmode=require`).

### 2.2 Encryption at Rest
* **Database Volume Encryption:** PostgreSQL tablespaces and storage volumes must be encrypted using AES-256.
* **Sensitive Column Encryption:** Personally Identifiable Information (PII) such as national identification numbers, patient government IDs, or sensitive medical notes are encrypted at rest using envelope encryption.
* **Database Backups:** All database dump artifacts and disaster recovery snapshots must be encrypted prior to storage in object repositories.

---

## 3. Authentication, Authorization & Session Management

1. **Password Hashing:** Django's default PBKDF2 with SHA-256 algorithm (minimum 720,000 iterations) or Argon2 password hashing. Passwords are never stored or logged in plain text.
2. **JWT Token Security:**
   - Access tokens have a maximum validity of 15 minutes.
   - Tokens are cryptographically signed using HMAC-SHA256 (`HS256`) or asymmetric `RS256` keys.
   - Refresh tokens are subject to one-time-use rotation; reusing an invalidated refresh token triggers immediate session revocation across all active tokens for that user account.
3. **Role-Based Access Control (RBAC):**
   - Access rights follow the Principle of Least Privilege (PoLP).
   - Direct database access is restricted; clinical staff can access records only within their assigned hospital and department.
   - Patients can only access their own appointments and dependents' profiles.

---

## 4. Environment Variables & Secrets Management

1. **Zero Hardcoded Secrets Policy:** No passwords, cryptographic secret keys, API tokens, or certificates may ever be committed to the Git repository.
2. **Version Control Exclusions:** The `.gitignore` file strictly excludes `.env`, `.env.local`, `*.pem`, `*.key`, and secret manifests.
3. **Environment Template Discipline:** Only `.env.example` files containing non-sensitive placeholder variables are tracked in version control.
4. **Key Rotation Protocol:** Production deployment environments must support seamless rotation of the `SECRET_KEY` and third-party API credentials without requiring downtime.

---

## 5. Web Application Defenses

### 5.1 Cross-Origin Resource Sharing (CORS)
* The backend enforces strict CORS policies using `django-cors-headers`.
* Wildcard origins (`CORS_ALLOW_ALL_ORIGINS = True`) are strictly prohibited in production.
* Allowed origins (`CORS_ALLOWED_ORIGINS`) are explicitly loaded from environment variables and restricted to authorized client domains (e.g. `https://app.queuefree.health`).

### 5.2 Cross-Site Scripting (XSS) & Content Security Policy (CSP)
* React's JSX architecture automatically escapes untrusted input.
* Content Security Policy (CSP) headers are configured at the web server layer to prohibit unauthorized script execution and restrict style/font sources.

### 5.3 Cross-Site Request Forgery (CSRF) & Cookie Hygiene
* Authentication cookies (if utilized for refresh tokens or session state) must enforce:
  - `HttpOnly = True`: Prevents client-side JavaScript access.
  - `Secure = True`: Transmitted solely over HTTPS.
  - `SameSite = 'Strict'`: Prevents cross-site request leakage.

### 5.4 SQL Injection Defense
* All database interactions are executed through the Django ORM, which employs parameterized queries.
* Raw SQL queries (`raw()` or cursor execution) are prohibited unless explicitly reviewed and approved by the security architect.

---

## 6. Audit Logging & Forensic Readiness

In compliance with healthcare information guidelines (HIPAA § 164.312(b)):
1. **Audit Scope:** Every login attempt (successful or failed), patient record view, appointment creation, queue state transition, and administrative configuration modification is written to the `audit_logs` table.
2. **Immutability:** Audit log tables are append-only. The database user assigned to normal application operations is restricted from executing `UPDATE` or `DELETE` queries on the `audit_logs` table.
3. **Log Sanitization:** Sensitive authorization headers, passwords, and full payment details are stripped before audit payloads are serialized.
