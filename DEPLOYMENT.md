# Deployment Guide

## 1. Frontend (Vercel)
The frontend is built with Next.js and is ready for Vercel.

### Steps:
1.  Push your code to GitHub.
2.  Go to [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New Project**.
3.  Import your `stock-predects` repository.
4.  **Framework Preset**: Next.js (should be auto-detected).
5.  **Root Directory**: If asked, select `frontend`. (The `vercel.json` file should handle this, but setting it in UI is safer).
6.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://stock-predects-backend.onrender.com/api/v1`).
    *   *Note: For now, you can leave this empty or set to `http://localhost:8000/api/v1` for local testing, but it won't work online until Backend is deployed.*
7.  Click **Deploy**.

## 2. Backend (Render / Railway)
**Important**: The backend cannot be hosted on Vercel because it uses a **background worker** for real-time data and requires **Redis**. Vercel is for serverless functions only.

We recommend **Render** or **Railway** as they support Docker and background workers.

### Option A: Render (Recommended)
1.  Create a [Render account](https://render.com/).
2.  **Create a Web Service** (for the API):
    *   Connect GitHub repo.
    *   **Root Directory**: `backend`
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
    *   **Environment Variables**:
        *   `FIREBASE_CREDENTIALS`: (Paste content of `firebase-adminsdk.json`)
        *   `REDIS_URL`: (See step 3)
3.  **Create a Redis Instance** (on Render):
    *   Copy the `REDIS_URL` and add it to the Web Service env vars.
4.  **Create a Background Worker** (optional, for real-time updates):
    *   Connect same repo.
    *   **Root Directory**: `backend`
    *   **Start Command**: `python app/worker.py`
    *   Add same Environment Variables.

### Option B: Railway
1.  Login to [Railway](https://railway.app/).
2.  New Project -> Deploy from GitHub repo.
3.  Add a **Redis** database from the Railway dashboard.
4.  Configure variables (`FIREBASE_CREDENTIALS`, `REDIS_URL`).
5.  Railway automatically detects the `Dockerfile` in `backend/` and builds it.

## 3. Linking Them
Once Backend is deployed:
1.  Copy the Backend URL (e.g., `https://your-app.onrender.com`).
2.  Go to Vercel -> Project Settings -> Environment Variables.
3.  Add `NEXT_PUBLIC_API_URL` = `https://your-app.onrender.com/api/v1`.
4.  Redeploy Frontend.
