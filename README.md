# 🔍 Reliability Monitoring Platform

A **containerized reliability monitoring platform** that continuously checks the availability and performance of websites/APIs, tracks uptime history, and exposes metrics via Prometheus and Grafana.

This project demonstrates **backend engineering, DevOps practices, and observability** in a real-world setup.

---

## ✨ Features

- ✅ User authentication (JWT-based)
- 🌐 Monitor websites and APIs
- ⏱ Track uptime, downtime, and response latency
- 🧠 Background worker for periodic health checks
- 📊 Prometheus metrics & Grafana dashboards
- 🐳 Dockerized microservice-style architecture
- 🧬 Alembic database migrations
- ☁️ Deployed on AWS EC2 (Free Tier friendly)

---

## 🏗 Architecture Overview

```
                    ┌──────────────┐
                    │   Internet   │
                    └──────┬───────┘
                           │
                   ┌───────▼────────┐
                   │   FastAPI API  │
                   │  (REST + JWT)  │
                   └───────┬────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │           PostgreSQL Database        │
        │   users | services | checks | alerts │
        └──────────────────┬──────────────────┘
                           │
                   ┌───────▼────────┐
                   │ Worker Service │
                   │ (Scheduler)   │
                   └───────┬────────┘
                           │
                   ┌───────▼────────┐
                   │ Prometheus     │
                   │ (/metrics)     │
                   └───────┬────────┘
                           │
                   ┌───────▼────────┐
                   │ Grafana        │
                   │ Dashboards     │
                   └────────────────┘
```

---

## 🧠 How It Works

1. Users register and authenticate using JWT
2. Users add services (URLs) to monitor
3. Background worker periodically checks services
4. Results are stored in PostgreSQL
5. Metrics are exposed via `/metrics`
6. Prometheus scrapes metrics
7. Grafana visualizes uptime & latency

---

## 🛠 Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- Pydantic v2
- Alembic

### Infrastructure & DevOps
- Docker & Docker Compose
- AWS EC2
- IAM (least privilege)
- GitHub Actions (CI)

### Observability
- Prometheus
- Grafana

### Database
- PostgreSQL

---

## 🚀 Running Locally

### Prerequisites
- Docker
- Docker Compose v2

### Steps

```bash
git clone https://github.com/Hrutvik66/reliability-platform.git
cd reliability-platform

cp .env.example .env
docker compose up --build
```

Access:
- API Docs → http://localhost:8000/docs
- Grafana → http://localhost:3000
- Prometheus → http://localhost:9090

---

## ☁️ AWS Deployment (Summary)

- EC2 `t3.micro` (Free Tier)
- Ubuntu 22.04
- Docker Compose
- Ports opened:
  - `8000` → API
  - `3000` → Grafana
- Alembic migrations run inside container

---

## 📊 Example Metrics

- `service_checks_total`
- `service_check_failures_total`
- `service_response_time_ms`

Example Grafana panels:
- Total checks per service
- Failure rate
- 95th percentile latency

---

## 🔐 Security

- JWT authentication
- Password hashing (bcrypt)
- IAM user with MFA
- No root account usage
- Environment-based secrets

---

## 🧪 CI Pipeline

GitHub Actions pipeline:
- Python syntax validation
- Docker image build (API + Worker)

---

## 🗺 Roadmap / Improvements

Planned enhancements:

- ✅ Refresh tokens
- ✅ Access token expiration handling
- ✅ Role-based access
- ✅ Alert notifications (Email / Slack / Telegram)
- 🌍 Domain + HTTPS
- 🧱 Terraform IaC
- 🧪 Automated tests
- 🎨 Frontend dashboard

---

## 👤 Author

**Hrutvik Malshikare**  
Backend / DevOps Engineer  
GitHub: https://github.com/Hrutvik66
