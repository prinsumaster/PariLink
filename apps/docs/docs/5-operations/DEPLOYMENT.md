# PariLink Production Deployment Guide

## 1. Prerequisites
- Docker Engine (v24+) and Docker Compose (v2.20+)
- A standard Linux VM (Ubuntu 22.04+ recommended)
- Minimum 4GB RAM, 2 vCPUs

## 2. Environment Configuration
1. Clone the repository: `git clone https://github.com/your-org/parilink.git`
2. Navigate to the root directory.
3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
4. **CRITICAL**: Edit `.env` and provide a cryptographically secure `JWT_SECRET` and `MASTER_ENCRYPTION_KEY_V1`.
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

## 3. Deploy via Docker Compose
PariLink ships with a production-ready `docker-compose.yml` that handles networking, secrets, and automatic ordering.

```bash
docker compose up --build -d
```

### What happens during deployment:
1. **Network**: A secure bridge network (`parilink_net`) is created.
2. **Databases**: PostgreSQL and Redis boot up securely.
3. **Storage**: MinIO boots up for S3-compatible document storage.
4. **Backend**: The API waits for the databases to be healthy, executes auto-migrations via `start.sh`, and then binds to port 8080.
5. **Frontend**: The Next.js web application waits for the API to be healthy and binds to port 3000.

## 4. Kubernetes Deployment (Enterprise)
For high availability, PariLink provides Kubernetes manifests located in the `k8s/` directory.

### Quick Start
1. Apply the namespace and configuration:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/configmap.yaml
   ```
2. Set your production secrets securely:
   ```bash
   # Make sure to edit k8s/secret.yaml before applying!
   kubectl apply -f k8s/secret.yaml
   ```
3. Deploy Stateful Services:
   ```bash
   kubectl apply -f k8s/postgres/
   kubectl apply -f k8s/redis/
   ```
4. Deploy Stateless Services:
   ```bash
   kubectl apply -f k8s/api/
   kubectl apply -f k8s/web/
   ```
5. Apply Network Policies:
   ```bash
   kubectl apply -f k8s/network-policies.yaml
   ```
6. Setup Ingress Controller:
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

## 5. Security Architecture
- **Non-Root Containers**: All custom Dockerfiles (`apps/api/Dockerfile`, `apps/web/Dockerfile`) execute as a restricted non-root user (`uid 1001`).
- **Secrets Management**: File-based Docker Secrets and K8s Opaque Secrets are utilized in place of raw environment variables for sensitive passwords.
- **Zero-Trust Networking**: Kubernetes NetworkPolicies restrict lateral movement (e.g. only the API pod can talk to Postgres/Redis).
- **Strict Startup Verification**: The backend will deliberately crash on startup if required production secrets are missing.
