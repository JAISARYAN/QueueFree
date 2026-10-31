# QueueFree — Infrastructure & Deployment Architecture

**Infrastructure Strategy:** Containerized Modular Monolith with Managed Cloud Services  
**Target Environments:** Local Development, Staging / Testing, Production  
**Version:** 1.0.0-PHASE-1  

---

## 1. Infrastructure Overview & Topology

QueueFree is architected for clean separation between presentation, application logic, and persistent storage. While Phase 1 establishes local development foundations, the infrastructure layout is designed for containerized cloud deployment on container orchestrators (such as AWS ECS / EKS, Google Cloud Run / GKE, or Azure Container Apps).

```
+---------------------------------------------------------------------------------+
|                                 INTERNET TRAFFIC                                |
+----------------------------------------+----------------------------------------+
                                         |
                                HTTPS (Port 443)
                                         |
+----------------------------------------v----------------------------------------+
|                          EDGE LOAD BALANCER / CDN                               |
|  - SSL / TLS 1.3 Termination                                                   |
|  - Web Application Firewall (WAF) & DDoS Protection                             |
|  - Static Asset Delivery (Vite compiled bundle, branding, images)               |
+-------------------+------------------------------------+------------------------+
                    |                                    |
            Path: /* (Web App)                 Path: /api/* (API Traffic)
                    |                                    |
+-------------------v-------------------+ +--------------v------------------------+
|       FRONTEND STATIC HOSTING         | |      BACKEND API APPLICATION PODS     |
|  - High-availability CDN / Nginx      | |  - Python 3.13 + Django 5.1 Gunicorn  |
|  - Client-side React Router Fallbacks | |  - ASGI Daphne / Uvicorn for Channels |
+---------------------------------------+ +--------------+------------------------+
                                                         |
                               +-------------------------+------------------------+
                               |                                                  |
                     PostgreSQL Protocol                              Redis Protocol
                               |                                                  |
+------------------------------v--------+ +---------------------------------------v
|      MANAGED RELATIONAL DATABASE      | |           MANAGED CACHE & BROKER      |
|  - PostgreSQL 17 (Primary + Standby)  | |  - Redis Cluster                      |
|  - Automated Snapshots & Encryption   | |  - Celery Worker Broker & Channels    |
+---------------------------------------+ +---------------------------------------+
```

---

## 2. Directory Structure & Organization

```
infrastructure/
├── README.md                   # Infrastructure architecture specification (this document)
├── deployment/                 # Deployment automation and platform configuration
│   ├── ci-cd/                  # Continuous Integration & Delivery pipeline definitions
│   └── nginx/                  # Production reverse-proxy configuration and SSL templates
└── docker/                     # Container blueprints
    ├── backend.Dockerfile      # Multi-stage production container for Django backend
    ├── frontend.Dockerfile     # Multi-stage build (Node build -> Nginx alpine)
    └── docker-compose.yml      # Local orchestration orchestrating Django, Postgres, Redis
```

---

## 3. Local Development Prerequisites

To operate QueueFree in local development:
* **Operating System:** Windows, macOS, or Linux.
* **Node.js:** v18.0.0+ (LTS v20+ or v24+ recommended).
* **Python:** v3.11+ (v3.13 recommended).
* **PostgreSQL:** v15+ (v17 recommended) running on `localhost:5432`.
* **Redis:** (Required in Phase 5 for real-time WebSocket features; optional in Phase 1).

---

## 4. Environment Variables Blueprint

Both frontend and backend rely strictly on externalized environment variables. Detailed templates are stored in:
- `backend/.env.example`
- `frontend/.env.example`

### Key Variables Summary

| Scope | Variable Name | Example Local Value | Production Requirement |
| :--- | :--- | :--- | :--- |
| **Backend** | `DEBUG` | `True` | Must be `False` |
| **Backend** | `SECRET_KEY` | `dev-insecure-placeholder...` | Strong 64-character random string |
| **Backend** | `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Exact production domain list |
| **Backend** | `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Exact frontend origin URL |
| **Backend** | `DB_NAME` | `queuefree_db` | Managed database name |
| **Backend** | `DB_USER` | `postgres` | Least-privilege application user |
| **Backend** | `DB_PASSWORD` | *(Local password)* | Secure secret from key vault |
| **Backend** | `DB_HOST` | `localhost` | Managed DB private endpoint |
| **Backend** | `DB_PORT` | `5432` | Standard PostgreSQL port |
| **Frontend** | `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | Production backend API domain |

---

## 5. Security & Isolation Guidelines

1. **Production Isolation:** Application containers must never run as `root`. Dockerfiles must declare and switch to a dedicated non-root user (e.g. `appuser`).
2. **Network Security:** Database and cache endpoints must reside in private VPC subnets with zero public internet ingress.
3. **Health Check Probing:** Container orchestrators should poll `GET /api/v1/health/` for liveness and readiness verification.
