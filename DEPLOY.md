# PariLink Logistics OS — Production Deployment Guide

This guide covers deploying the PariLink platform to a fresh, clean Ubuntu Server (22.04 or 24.04). No prior DevOps expertise is required.

## Prerequisites

1. **A fresh Ubuntu VPS** (e.g., DigitalOcean Droplet, AWS Lightsail, Linode) with at least **2 CPU cores and 4GB RAM**.
2. **A registered domain name** (e.g., `parilink.com`).
3. **DNS Records:** Point the `A` record of your domain to the public IP address of your VPS.

---

## Step 1: Connect to your Server

Open your terminal and connect to your server via SSH:

```bash
ssh root@<YOUR_SERVER_IP>
```

---

## Step 2: Install Docker & Docker Compose

Docker runs the isolated containers for the database, cache, API, and Web app. Install it using the official script:

```bash
# Download the Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run the script
sh get-docker.sh

# Verify installation
docker --version
docker compose version
```

---

## Step 3: Clone the Application Repository

Since this is a private repository, the safest way to clone it without leaving your personal GitHub credentials on the server is to use a Fine-Grained Personal Access Token (PAT) or a Deploy Key. 

```bash
# Clone the repository using your Private URL
# Example: git clone https://<YOUR_GITHUB_USERNAME>:<YOUR_PAT>@github.com/your-org/parilink-private.git
git clone <YOUR_PRIVATE_REPO_URL>

# Enter the directory
cd parilink
```

---

## Step 4: Configure the Production Secrets (`.env`)

For security, the `.env` file containing your real secrets is strictly `.gitignored` and will **never** be cloned from your repository. You must create it fresh directly on the server:

```bash
# Copy the placeholder template to create your fresh .env file
cp .env.example .env

# Open it for editing
nano .env
```

### 🚨 Mandatory Production Checklist:
You **must** replace all `CHANGE_ME` values in the `.env` file before going live:

- `DOMAIN`: Set this to your actual domain (e.g., `parilink.com`). Caddy uses this to automatically fetch your SSL padlock.
- `POSTGRES_PASSWORD`: Generate a strong, random password.
- `JWT_SECRET`: The core security key for user sessions. Generate a 64-byte hex string (`openssl rand -hex 64`).
- `ENCRYPTION_KEY`: A 32-character key for encrypting API keys at rest.
- `MASTER_ENCRYPTION_KEY_V1`: A 64-character hex key for encrypting highly sensitive PII data.
- `MINIO_ACCESS_KEY` & `MINIO_SECRET_KEY`: Set strong credentials for the object storage (file uploads).
- `COOKIE_SECRET`: A strong random string for securing cookies.
- **External APIs:** Insert your live keys for Razorpay, Resend, Twilio, and Mapbox.

*(Press `Ctrl+O` then `Enter` to save the file in nano, and `Ctrl+X` to exit).*

---

## Step 5: Build and Start the Application

Command Docker to build the images and start the system in detached mode (`-d`):

```bash
docker compose up -d --build
```

To verify everything is running smoothly, check the container status:

```bash
docker compose ps
```
You should see all containers (api, web, postgres, redis, minio, caddy) with the status `Up (healthy)`.

---

## Step 6: First-Run Database Setup

Run the one-time migration and seed command to build the tables and inject the initial admin accounts:

```bash
docker compose exec api sh -c 'npm run seed'
```

*Expected output: `🌱 Database seeded successfully with default tenants and admin accounts.`*

---

## Step 7: Access Your Live Site

Open your browser and navigate to `https://<YOUR_DOMAIN>`. 

Caddy has automatically provisioned your Let's Encrypt SSL certificate. You should see the secure PariLink login page. 

**Deployment Complete!** 🚀
