# EventFlow Deployment Guide

This project has two apps:
- `backend/` (Node.js + Express + MongoDB)
- `frontend/` (React + Vite)

## 1) Backend deployment

### Environment variables
Create `backend/.env` from `backend/.env.example` and set:
- `NODE_ENV=production`
- `PORT` (platform may override automatically)
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URLS` (comma-separated allowed frontend origins)

### Install and run
```bash
cd backend
npm install
npm start
```

### Health check
- `GET /api/health`

## 2) Frontend deployment

### Environment variables
Create `frontend/.env` from `frontend/.env.example` and set:
- `VITE_API_URL`
  - Use `/api` if your frontend and backend are on same domain via reverse proxy.
  - Use full backend URL (for example `https://api.example.com/api`) if deployed separately.
- `VITE_BACKEND_URL`
  - Backend public origin used for image URLs from `/uploads`.
  - Example: `https://api.example.com`

### Build
```bash
cd frontend
npm install
npm run build
```

Deploy the generated `frontend/dist/` folder to your static hosting provider.

## 3) Reverse proxy example (same domain)

If you serve frontend and backend under one domain, route:
- `/api/*` -> backend service
- `/uploads/*` -> backend service
- everything else -> frontend static app

## 4) Quick production checklist
- Backend reachable and returns `200` on `/api/health`
- Frontend `VITE_API_URL` and `VITE_BACKEND_URL` are correct
- `FRONTEND_URLS` includes your real frontend domain
- MongoDB Atlas Network Access allows your Railway backend IP or uses `0.0.0.0/0` for testing
- `JWT_SECRET` is strong and private
