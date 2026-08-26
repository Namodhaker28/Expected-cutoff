# Deploy: Render (backend) + Vercel (frontend)

## Overview

```
Browser → Vercel (Next.js) → /api/* rewrite → Render (Express) → MongoDB Atlas
```

---

## Step 1 — MongoDB Atlas (free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. **Database Access** → create a user with password.
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`).
4. **Connect** → Drivers → copy connection string:
   ```
   mongodb+srv://USER:PASSWORD@cluster.mongodb.net/expected-cutoff
   ```

---

## Step 2 — Push code to GitHub

If not already on GitHub:

```bash
git init -b main
git add -A
git commit -m "Initial commit"
gh repo create Expected-cutoff --public --source=. --push
```

---

## Step 3 — Deploy backend on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** (or **Web Service**).
2. Connect your GitHub repo `Expected-cutoff`.
3. If using **Blueprint**, Render reads [`render.yaml`](render.yaml) automatically.
4. If using **Web Service** manually:

   | Setting | Value |
   |---------|--------|
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Health Check Path | `/api/health` |

5. Set environment variables in Render dashboard:

   | Key | Value |
   |-----|--------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Long random string (Render can auto-generate) |
   | `GEMINI_API_KEY` | From [Google AI Studio](https://aistudio.google.com/apikey) |
   | `GEMINI_MODEL` | `gemini-2.0-flash` |
   | `FRONTEND_URL` | Your Vercel URL (set after Step 4), e.g. `https://expected-cutoff.vercel.app` |

6. Deploy and copy your API URL, e.g. `https://expected-cutoff-api.onrender.com`.

7. **Seed the database** (one time) — Render dashboard → your service → **Shell**:

   ```bash
   npm run seed
   ```

8. Verify: open `https://YOUR-API.onrender.com/api/health`

---

## Step 4 — Deploy frontend on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → import your GitHub repo.
2. Configure:

   | Setting | Value |
   |---------|--------|
   | Framework Preset | Next.js |
   | Root Directory | `frontend` |

3. **Environment Variables** (required — rewrites are baked in at build time):

   | Key | Value |
   |-----|--------|
   | `API_URL` | `https://YOUR-API.onrender.com/api` |
   | `NEXT_PUBLIC_API_URL` | `/api` |

4. Click **Deploy**.

5. Copy your Vercel URL, e.g. `https://expected-cutoff.vercel.app`.

6. Go back to **Render** → set `FRONTEND_URL` to your Vercel URL → redeploy backend (optional, for direct API calls).

---

## Step 5 — Verify end-to-end

1. Open your Vercel URL.
2. Exams should load on the home page.
3. Pick an exam → submit a score → see prediction.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Empty exam list | Run `npm run seed` in Render Shell |
| API errors on Vercel | Check `API_URL` env var, then **Redeploy** Vercel |
| MongoDB connection failed | Check Atlas IP whitelist and `MONGODB_URI` |
| Render slow first load | Free tier cold start (~30–60s) |
| Gemini "Add exam" fails | Set `GEMINI_API_KEY` on Render |
| CORS errors | Set `FRONTEND_URL` on Render to exact Vercel URL |

---

## Local vs production env

**Backend** (`backend/.env`):
```
MONGODB_URI=...
JWT_SECRET=...
GEMINI_API_KEY=...
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```
API_URL=http://localhost:5001/api
NEXT_PUBLIC_API_URL=/api
```
