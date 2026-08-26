#!/usr/bin/env bash
# Deploy Expected Cutoff via CLI (Render + Vercel)
#
# Usage:
#   export RENDER_API_KEY="rnd_..."          # dashboard.render.com → Account Settings → API Keys
#   export MONGODB_URI="mongodb+srv://..."   # MongoDB Atlas (NOT localhost)
#   export GEMINI_API_KEY="..."
#   vercel login                             # personal account
#   ./scripts/deploy-cli.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RENDER="${ROOT}/.bin/render"
REPO="https://github.com/Namodhaker28/Expected-cutoff"
SERVICE_NAME="expected-cutoff-api"

die() { echo "ERROR: $1" >&2; exit 1; }
info() { echo "→ $1"; }

# --- Validate ---
[[ -x "$RENDER" ]] || die "Run: mkdir -p .bin && install render CLI (see DEPLOY.md)"
[[ -n "${RENDER_API_KEY:-}" ]] || die "Set RENDER_API_KEY"
[[ -n "${MONGODB_URI:-}" ]] || die "Set MONGODB_URI (MongoDB Atlas connection string)"
[[ -n "${GEMINI_API_KEY:-}" ]] || die "Set GEMINI_API_KEY"
vercel whoami &>/dev/null || die "Run: vercel login"

export CI=true
JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-2.0-flash}"

info "Render: fetching owner ID..."
OWNER_ID=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/owners" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if not data: raise SystemExit('No owners found')
print(data[0]['owner']['id'])
" 2>/dev/null) || die "Invalid RENDER_API_KEY or API error"

info "Render: checking for existing service..."
EXISTING=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services?limit=50" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for item in data:
    s = item.get('service', item)
    if s.get('name') == '$SERVICE_NAME':
        print(s['id'])
        break
" 2>/dev/null || true)

if [[ -z "$EXISTING" ]]; then
  info "Render: creating web service..."
  CREATE_RESP=$(curl -s -X POST "https://api.render.com/v1/services" \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "
import json, os
print(json.dumps({
  'type': 'web_service',
  'name': '$SERVICE_NAME',
  'ownerId': '$OWNER_ID',
  'repo': '$REPO',
  'autoDeploy': 'yes',
  'branch': 'main',
  'rootDir': 'backend',
  'runtime': 'node',
  'buildCommand': 'npm install',
  'startCommand': 'npm start',
  'plan': 'free',
  'region': 'singapore',
  'envVars': [
    {'key': 'NODE_ENV', 'value': 'production'},
    {'key': 'MONGODB_URI', 'value': os.environ['MONGODB_URI']},
    {'key': 'JWT_SECRET', 'value': os.environ['JWT_SECRET']},
    {'key': 'GEMINI_API_KEY', 'value': os.environ['GEMINI_API_KEY']},
    {'key': 'GEMINI_MODEL', 'value': os.environ['GEMINI_MODEL']},
  ]
}))
")")
  SERVICE_ID=$(echo "$CREATE_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)
  [[ -n "$SERVICE_ID" ]] || die "Failed to create Render service: $CREATE_RESP"
else
  SERVICE_ID="$EXISTING"
  info "Render: service exists ($SERVICE_ID), triggering deploy..."
  "$RENDER" deploys create "$SERVICE_ID" --confirm -o text 2>/dev/null || \
    curl -s -X POST "https://api.render.com/v1/services/${SERVICE_ID}/deploys" \
      -H "Authorization: Bearer $RENDER_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{}' >/dev/null
fi

info "Render: waiting for deploy (may take 3-5 min on free tier)..."
for i in $(seq 1 30); do
  STATUS=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
    "https://api.render.com/v1/services/${SERVICE_ID}" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('serviceDetails', {}).get('url', d.get('url', 'pending')))
" 2>/dev/null || echo "pending")
  if [[ "$STATUS" == https://* ]]; then
    RENDER_HOST="$STATUS"
    break
  fi
  sleep 10
done

[[ -n "${RENDER_HOST:-}" ]] || RENDER_HOST="https://${SERVICE_NAME}.onrender.com"
RENDER_API_URL="${RENDER_HOST}/api"
info "Render API: $RENDER_API_URL"

info "Render: seeding database (one-time)..."
info "Run manually in Render Shell: npm run seed"
info "  Dashboard → $SERVICE_NAME → Shell → npm run seed"

# --- Vercel ---
info "Vercel: deploying frontend..."
cd "$ROOT/frontend"
export RENDER_API_URL

vercel link --yes --project expected-cutoff 2>/dev/null || true
printf '%s' "$RENDER_API_URL" | vercel env add API_URL production --force 2>/dev/null || \
  printf '%s' "$RENDER_API_URL" | vercel env add API_URL production
printf '%s' '/api' | vercel env add NEXT_PUBLIC_API_URL production --force 2>/dev/null || \
  printf '%s' '/api' | vercel env add NEXT_PUBLIC_API_URL production

VERCEL_URL=$(vercel --prod --yes 2>&1 | grep -oE 'https://[a-zA-Z0-9.-]+\.vercel\.app' | tail -1)
info "Vercel: ${VERCEL_URL:-deployed (check vercel dashboard)}"

if [[ -n "${VERCEL_URL:-}" ]]; then
  info "Render: set FRONTEND_URL=$VERCEL_URL (update in dashboard if needed)"
fi

echo ""
echo "✓ Deploy complete!"
echo "  Backend:  $RENDER_API_URL/health"
echo "  Frontend: ${VERCEL_URL:-see Vercel dashboard}"
echo "  Don't forget: npm run seed in Render Shell"
