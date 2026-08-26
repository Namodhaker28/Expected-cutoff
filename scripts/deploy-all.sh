#!/usr/bin/env bash
# Full CLI deploy: Render backend + Vercel frontend
#
# Required env vars (export before running):
#   MONGODB_URI          - MongoDB Atlas connection string
#   GEMINI_API_KEY       - Google AI Studio key
#   RENDER_API_KEY       - From https://dashboard.render.com/u/settings#api-keys
#   RENDER_API_URL       - Set AFTER Render deploy (or script prints next steps)
#
# Optional:
#   JWT_SECRET           - Auto-generated if unset
#   FRONTEND_URL         - Set on Render after Vercel deploy
#
# Prerequisites:
#   vercel login         - Sign in with your personal Vercel account
#   gh auth switch --user Namodhaker28

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RENDER="${ROOT}/.bin/render"
REPO="https://github.com/Namodhaker28/Expected-cutoff"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

die() { echo -e "${RED}Error:${NC} $1" >&2; exit 1; }
info() { echo -e "${GREEN}→${NC} $1"; }

# --- Checks ---
[[ -x "$RENDER" ]] || die "Render CLI missing. Run: curl install from DEPLOY.md"
[[ -n "${MONGODB_URI:-}" ]] || die "Set MONGODB_URI (MongoDB Atlas connection string)"
[[ -n "${GEMINI_API_KEY:-}" ]] || die "Set GEMINI_API_KEY"
[[ -n "${RENDER_API_KEY:-}" ]] || die "Set RENDER_API_KEY from Render dashboard"

export CI=true
export RENDER_API_KEY

JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"

# --- Step 1: Render login via API key ---
info "Checking Render API..."
"$RENDER" workspaces list -o json >/dev/null 2>&1 || die "Invalid RENDER_API_KEY"

# --- Step 2: Create or update Render service via Blueprint ---
info "Deploying backend to Render (Blueprint)..."
info "If this is your first deploy, open: https://render.com/deploy?repo=${REPO}"
info "Or create service manually with rootDir=backend, then set env vars."

# Create web service via API if not exists
SERVICE_NAME="expected-cutoff-api"

info "Triggering Render deploy (requires existing service linked to GitHub)..."
info "Run these commands after creating the service on Render once:"
echo ""
echo "  export RENDER_SERVICE_ID=srv-xxxxx   # from Render dashboard"
echo "  $RENDER deploys create \$RENDER_SERVICE_ID --wait -o json"
echo ""

# --- Step 3: Vercel ---
if ! vercel whoami &>/dev/null; then
  die "Run: vercel login (use your personal account)"
fi

VERCEL_USER=$(vercel whoami 2>/dev/null)
info "Vercel logged in as: $VERCEL_USER"

if [[ -z "${RENDER_API_URL:-}" ]]; then
  echo ""
  echo "After Render is live, set RENDER_API_URL and re-run Vercel step:"
  echo "  export RENDER_API_URL=https://expected-cutoff-api.onrender.com/api"
  echo "  $ROOT/scripts/deploy-vercel.sh"
  exit 0
fi

info "Deploying frontend to Vercel..."
"$ROOT/scripts/deploy-vercel.sh"

info "Done! Set FRONTEND_URL on Render to your Vercel URL."
