# Warden — Production Deployment Guide

This document outlines the requirements, containerization strategies, network architecture, and security hardening procedures for deploying the Warden Enterprise OT/ICS Telemetry Platform in production and mission-critical manufacturing facilities.

---

## 🏗️ Production Architecture Overview

Warden supports both **Central Cloud/HQ Deployments** and **Air-Gapped / Isolated OT Edge Deployments**:

```
[ Plant OT Network / Direct Control (Level 1-2) ]
          │ (Modbus TCP, S7comm, SNMP, Syslog)
          ▼
[ Warden Edge Collector Appliance (Level 3.5 OT DMZ) ]
          │ (mTLS 1.3 encrypted tunnel / Unidirectional Data Diode)
          ▼
[ Warden Central Enterprise Cluster (Corporate IT / Cloud) ]
   ├── Ingestion Gateway (Syslog RFC 5424 + Agent WebSocket API)
   ├── Stream Processing & MITRE Correlation Engine
   ├── Long-term Cold Storage (Encrypted NVMe / Cloud Storage)
   └── Warden Web Management Console (React / SPA on Port 3000)
```

---

## 📦 Containerized Deployment (Docker & Podman)

### 1. Multi-Stage Dockerfile

```dockerfile
# syntax=docker/dockerfile:1

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Nginx / Reverse Proxy
FROM nginx:alpine-slim AS runner

# Copy compiled static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy hardened nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Bind to standard internal port
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Hardened Nginx Configuration (`nginx.conf`)

```nginx
server {
    listen 3000;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https: wss:;" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Single-Page Application (SPA) routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public, max-age=15552000, immutable";
    }
}
```

---

## ☸️ Kubernetes / OpenShift Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: warden-console
  namespace: warden-security
  labels:
    app.kubernetes.io/name: warden-console
spec:
  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: warden-console
  template:
    metadata:
      labels:
        app.kubernetes.io/name: warden-console
    spec:
      containers:
        - name: console
          image: registry.corp.internal/warden/console:v0.2.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
              name: http
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            runAsUser: 10001
            capabilities:
              drop:
                - ALL
---
apiVersion: v1
kind: Service
metadata:
  name: warden-console-svc
  namespace: warden-security
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: warden-console
  ports:
    - port: 3000
      targetPort: 3000
      name: http
```

---

## 🔒 Security Hardening & OT Isolation Best Practices

1. **mTLS 1.3 Certificate Authority**:
   - Issue intermediate subordinate CAs per plant site (e.g., `Warden Site CA - CHN-01`).
   - Rotate endpoint client certificates at 90-day automated intervals.

2. **Network Segmentation**:
   - Ensure collector nodes in Level 3.5 OT DMZ only permit outbound traffic on Port 443 to the Warden Central Cluster.
   - Strictly prohibit direct Layer 2/3 routing from Enterprise IT to Level 1/2 control networks.

3. **Break-Glass Emergency Access**:
   - Maintain air-gapped local administrative credentials for incident response during upstream WAN outages.
