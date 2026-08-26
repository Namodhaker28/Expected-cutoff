# Expected Cutoff

Crowdsourced exam cutoff prediction platform built with the MERN stack.

Predict expected cutoffs for India's top exams using crowdsourced student feedback, historical cutoff data, and structural factors (seats & applicants).

## Stack

- **Frontend:** Next.js 14, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Supported Exams (MVP)

JEE Main, NEET, JEE Advanced, GATE, CAT, UPSC CSE Prelims, SSC CGL, IBPS PO, CLAT, CUET UG

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend `.env`

```
GEMINI_API_KEY=your-key-from-aistudio.google.com
```

Get a free API key at [Google AI Studio](https://aistudio.google.com/apikey).

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed    # seed exam & historical data
npm run dev     # http://localhost:5001
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # http://localhost:3000
```

## API Overview

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/exams` | List all exams |
| GET | `/api/exams/:slug` | Exam detail + sessions |
| GET | `/api/exams/:slug/history` | Historical cutoffs |
| GET | `/api/exams/:slug/predict` | Run prediction |
| POST | `/api/exams/create` | Add exam via Gemini AI |
| POST | `/api/submissions` | Submit score & difficulty |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/user/submissions` | User's submissions (JWT) |

## Prediction Model

```
expectedCutoff = 30% crowd data + 40% historical trend + 30% structural factors
```

- Outlier trimming (top/bottom 2%) on crowd submissions
- Weighted moving average on historical cutoffs
- Seat & applicant density adjustments

## Deploy to production

### All-in-one on Vercel (recommended)

Deploy **frontend + backend together** on one Vercel project: **[DEPLOY-VERCEL.md](DEPLOY-VERCEL.md)**

### Split deploy (Render + Vercel)

- **Backend:** [Render](https://render.com) — see [`render.yaml`](render.yaml)
- **Frontend:** [Vercel](https://vercel.com) — root directory `frontend`
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)

Full guide: **[DEPLOY.md](DEPLOY.md)**
