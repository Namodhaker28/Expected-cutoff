# Deploy on Vercel (frontend + backend together)

Both Next.js frontend and Express backend deploy as **one Vercel project** using [Vercel Services](https://vercel.com/docs/services).

```
Browser → your-app.vercel.app/api/*  → Express backend
        → your-app.vercel.app/*      → Next.js frontend
```

---

## 1. Import project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **`Namodhaker28/Expected-cutoff`**
3. Set **Framework Preset** to **Services** (important!)
4. Root directory: `./` (repo root)

Vercel reads [`vercel.json`](vercel.json) at the repo root. It uses the **Services** format with `"type": "service"` in rewrites.

> **Note:** Vercel may suggest `/api/backend` as the backend path. We use `/api/:path*` instead because Express routes are already defined as `/api/exams`, `/api/health`, etc. — matching the frontend's `NEXT_PUBLIC_API_URL=/api`.

---

## 2. Environment variables

Add these in **Project Settings → Environment Variables** (shared by both services):

| Variable | Example |
|----------|---------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/expected-cutoff` |
| `JWT_SECRET` | long random string |
| `GEMINI_API_KEY` | from Google AI Studio |
| `GEMINI_MODEL` | `gemini-2.0-flash` |
| `NEXT_PUBLIC_API_URL` | `/api` |

**Password tip:** If your MongoDB password contains `@`, encode it as `%40`.

---

## 3. Deploy

Click **Deploy**. After build completes:

1. Open your app URL
2. Test API: `https://your-app.vercel.app/api/health`
3. **Seed database once** (run locally against Atlas):

```bash
cd backend
MONGODB_URI="your-atlas-uri" npm run seed
```

---

## 4. Local dev

**Option A — Both services together (matches production):**
```bash
vercel dev
```

**Option B — Separate terminals:**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "vercel.json required for multiple services" | Set Framework Preset to **Services**, ensure root `vercel.json` exists |
| API 404 | Check rewrites in root `vercel.json`; redeploy |
| DB connection failed | Verify `MONGODB_URI`, encode special chars in password |
| Empty exam list | Run `npm run seed` against Atlas |

---

## Render (alternative)

If you prefer Render for backend only, see the original Render + Vercel split in [`DEPLOY.md`](DEPLOY.md).
