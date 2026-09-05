# Warden — Production Deployment Guide

This document provides detailed deployment architectures, containerization recipes, and security hardening procedures for running **Warden** in production enterprise environments.

---

## Table of Contents

1. [Deployment Architecture Overview](#1-deployment-architecture-overview)
2. [Building for Production](#2-building-for-production)
3. [Containerized Deployment (Docker & Nginx)](#3-containerized-deployment-docker--nginx)
   - [Multi-Stage Dockerfile](#multi-stage-dockerfile)
   - [Production Nginx Configuration](#production-nginx-configuration)
   - [Docker Compose for On-Premises SOC](#docker-compose-for-on-premises-soc)
4. [Cloud Deployments](#4-cloud-deployments)
   - [Google Cloud Run](#google-cloud-run)
   - [Kubernetes (K8s) Manifests](#kubernetes-k8s-manifests)
   - [Static Web Hosting (AWS S3 + CloudFront / Cloudflare Pages)](#static-web-hosting)
5. [Environment Variables & Secret Management](#5-environment-variables--secret-management)
6. [Security Hardening & Best Practices](#6-security-hardening--best-practices)
7. [Observability & Health Checks](#7-observability--health-checks)

---

## 1. Deployment Architecture Overview

Warden can be deployed under two standard operational models:

| Model | Description | Best Suited For |
| :--- | :--- | :--- |
| **Static SPA (Recommended)** | High-performance compiled static assets served via Nginx, CDN, or Cloud Storage. | Cloud Run, S3/CloudFront, Cloudflare, Kubernetes |
| **Full-Stack Node/Express** | Custom Node.js/Express server proxying backend telemetry endpoints and AI services. | Hybrid enterprise networks with internal telemetry APIs |

---

## 2. Building for Production

To create an optimized, minified production distribution:

```bash
npm run build
```

This generates production-ready assets in the `dist/` directory:
- Tree-shaken JavaScript bundles with content-hash filenames (e.g., `assets/index-C8x29a.js`)
- Pre-compiled, scoped Tailwind CSS v4 stylesheets
- Cache-busting static asset hashes

To preview the compiled production distribution locally:
```bash
npm run preview
```

---

## 3. Containerized Deployment (Docker & Nginx)

For container platforms (Docker, Podman, Kubernetes, Cloud Run), a multi-stage Docker build produces a lightweight, secure container image (~25MB).

### Multi-Stage Dockerfile

Create a `Dockerfile` in the root directory:

```dockerfile
# ==========================================
# Stage 1: Build & Compile
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy source code
COPY . .

# Compile production bundle
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Static Server
# ==========================================
FROM nginx:1.27-alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard web port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
```

### Production Nginx Configuration

Create `nginx.conf` in the project root:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;
    gzip_disable "MSIE [1-6]\.";

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" always;

    # SPA Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache Static Assets
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health Check Endpoint
    location /healthz {
        access_log off;
        return 200 "healthy\n";
    }
}
```

### Docker Compose for On-Premises SOC

Create `docker-compose.yml` for single-host production deployments:

```yaml
version: '3.8'

services:
  warden-platform:
    build:
      context: .
      dockerfile: Dockerfile
    image: warden-soc:latest
    container_name: warden_soc_app
    restart: always
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost/healthz"]
      interval: 30s
      timeout: 5s
      retries: 3
```

Launch with:
```bash
docker compose up -d --build
```

---

## 4. Cloud Deployments

### Google Cloud Run

Google Cloud Run provides fully managed serverless container execution with auto-scaling and zero maintenance.

1. **Build and submit image to Google Artifact Registry**:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/warden-platform:latest
   ```

2. **Deploy container service**:
   ```bash
   gcloud run deploy warden-platform \
     --image gcr.io/YOUR_PROJECT_ID/warden-platform:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 80 \
     --min-instances 1 \
     --max-instances 10 \
     --cpu 1 \
     --memory 512Mi
   ```

---

### Kubernetes (K8s) Manifests

Deploy Warden into your enterprise Kubernetes cluster:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: warden-soc-deployment
  labels:
    app: warden-soc
spec:
  replicas: 2
  selector:
    matchLabels:
      app: warden-soc
  template:
    metadata:
      labels:
        app: warden-soc
    spec:
      containers:
      - name: warden-soc
        image: your-registry.example.com/warden-soc:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /healthz
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: warden-soc-service
spec:
  type: ClusterIP
  selector:
    app: warden-soc
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

---

### Static Web Hosting

Because the compiled output in `dist/` is completely static, you can deploy it directly to object storage with global CDN caching:

- **AWS S3 + CloudFront**: Upload `dist/` to an S3 bucket configured for static web hosting and attach a CloudFront distribution with a Custom Error Response mapping HTTP 404 to `/index.html` (HTTP 200).
- **Cloudflare Pages**: Connect your GitHub repository with Build Command `npm run build` and Output Directory `dist`.
- **Firebase / GCP Cloud Storage**: Deploy with `firebase deploy --only hosting`.

---

## 5. Environment Variables & Secret Management

- **Client-Side Variables (`VITE_*`)**: Variables injected at build time (e.g., `VITE_API_ENDPOINT`). These are public in client bundles.
- **Server-Side Secrets**: If deploying a full-stack proxy (e.g. `GEMINI_API_KEY`, API tokens), use Secret Management services:
  - **GCP**: Google Secret Manager (`gcloud secrets ...`)
  - **AWS**: AWS Secrets Manager / SSM Parameter Store
  - **Kubernetes**: `Secret` objects mapped as environment variables

---

## 6. Security Hardening & Best Practices

1. **Enforce HTTPS / TLS 1.3**: Terminate TLS at the Ingress Controller / Load Balancer. Reject all unencrypted HTTP traffic with 301 redirects.
2. **Implement RBAC & SSO**: Connect upstream authentication (OIDC, SAML, Azure AD, Okta) at the reverse proxy or API gateway layer.
3. **Content Security Policy (CSP)**: Ensure your Nginx configuration restricts script execution to trusted origins.
4. **Log Retention & Immutable Audit**: Forward container access logs to your central SIEM (Splunk, Elastic, Sentinel) for SOC compliance.

---

## 7. Observability & Health Checks

- **Health Probe**: `/healthz` returns `200 OK` when the web server is responsive.
- **Client Error Monitoring**: Integrate Sentry or Datadog RUM in `src/main.tsx` for client-side crash tracking.
- **Resource Sizing**: Baseline memory utilization for Warden is ~25MB per container pod, with rapid response times (<15ms).

---

*For local developer setup and codebase walkthroughs, refer to the [Development Setup Guide](./DEVELOPMENT.md).*
