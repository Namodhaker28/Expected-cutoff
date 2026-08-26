#!/usr/bin/env bash
# Deploy frontend to Vercel (personal account)
# Prerequisites: vercel login (personal), RENDER_API_URL set after backend is live
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/frontend"

if ! vercel whoami &>/dev/null; then
  echo "Run: vercel login"
  exit 1
fi

RENDER_API_URL="${RENDER_API_URL:-}"
if [[ -z "$RENDER_API_URL" ]]; then
  echo "Set RENDER_API_URL, e.g. https://expected-cutoff-api.onrender.com/api"
  exit 1
fi

echo "Linking Vercel project..."
vercel link --yes --project expected-cutoff 2>/dev/null || vercel link --yes --project expected-cutoff

echo "Setting env vars..."
printf '%s' "$RENDER_API_URL" | vercel env add API_URL production --force 2>/dev/null || \
  printf '%s' "$RENDER_API_URL" | vercel env add API_URL production
printf '%s' '/api' | vercel env add NEXT_PUBLIC_API_URL production --force 2>/dev/null || \
  printf '%s' '/api' | vercel env add NEXT_PUBLIC_API_URL production

echo "Deploying to production..."
vercel --prod --yes

echo "Done! Set FRONTEND_URL on Render to your Vercel URL."
