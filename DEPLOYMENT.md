# AWS Deployment Guide

This guide explains how to deploy the Stock Predects application on Amazon Web Services (AWS).

## Architecture Overview
- **Frontend**: AWS Amplify (Best for Next.js CI/CD)
- **Backend**: AWS EC2 (Dockerized FastAPI + Redis + Worker)
- **Database**: Firebase Firestore (External)

---

## 1. Backend Deployment (AWS EC2)
Since the backend requires a background worker and Redis, an EC2 instance is the most cost-effective and flexible option.

### Step 1: Launch an EC2 Instance
1.  Log in to AWS Console -> **EC2**.
2.  **Launch Instance**:
    *   **Name**: `stock-predects-backend`
    *   **OS**: Ubuntu Server 22.04 LTS
    *   **Instance Type**: `t2.micro` (Free Tier eligible) or `t3.small` (Recommended).
    *   **Key Pair**: Create a new one (e.g., `stock-key`) and download the `.pem` file.
    *   **Security Group**: Allow SSH (22), HTTP (80), and Custom TCP (8000).

### Step 2: Prepare the Instance
SSH into your instance:
```bash
ssh -i "path/to/stock-key.pem" ubuntu@<your-ec2-public-ip>
```

Install Docker & Git:
```bash
sudo apt update
sudo apt install docker.io docker-compose git -y
sudo usermod -aG docker $USER
# Log out and log back in for group changes to take effect
exit
ssh -i ...
```

### Step 3: Deploy Code
1.  Clone your repository:
    ```bash
    git clone https://github.com/mjmanojs/StockPredects.git
    cd StockPredects
    ```
2.  Create `.env` file for Backend:
    ```bash
    cd backend
    nano .env
    ```
    *Paste your environment variables (FIREBASE config, etc).*

3.  Create `docker-compose.yml` (if not present) or run with Docker:
    ```bash
    # Build and Run
    docker build -t stock-backend .
    
    # Run Redis
    docker run -d --name redis -p 6379:6379 redis
    
    # Run Backend (Link to Redis)
    docker run -d --name backend -p 8000:8000 --link redis:redis -e REDIS_URL=redis://redis:6379/0 stock-backend
    
    # Run Worker
    docker run -d --name worker --link redis:redis -e REDIS_URL=redis://redis:6379/0 stock-backend python app/worker.py
    ```

### Step 4: Configure Firewall
Ensure AWS Security Group allows traffic on port `8000`.
Your Backend URL will be: `http://<your-ec2-public-ip>:8000`

---

## 2. Frontend Deployment (AWS Amplify)
AWS Amplify is the easiest way to deploy Next.js apps.

1.  Go to **AWS Amplify Console**.
2.  **New App** -> **Host Web App**.
3.  Select **GitHub** and authorize.
4.  Select `StockPredects` repository and `main` branch.
5.  **Build Settings**:
    *   Amplify automatically detects Next.js.
    *   Ensure `baseDirectory` is set to `frontend/.next`.
    *   **Important**: Edit the build settings to point to the `frontend` directory:
        ```yaml
        version: 1
        applications:
          - frontend:
              phases:
                preBuild:
                  commands:
                    - npm ci
                build:
                  commands:
                    - npm run build
              artifacts:
                baseDirectory: .next
                files:
                  - '**/*'
              cache:
                paths:
                  - node_modules/**/*
            appRoot: frontend
        ```
6.  **Environment Variables**:
    *   Add `NEXT_PUBLIC_API_URL` = `http://<your-ec2-public-ip>:8000/api/v1`
    *   Add Firebase config variables (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc).
7.  Click **Save and Deploy**.

---

## 3. Final Steps
1.  Once Amplify finishes, you will get a domain (e.g., `https://main.d123.amplifyapp.com`).
2.  Open the app and test Login and Search.
