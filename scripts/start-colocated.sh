#!/usr/bin/env bash
# Same-host boot: OneDev on :6610 (loopback only from the app's perspective) + IPF Node on $PORT.
# Railway / Docker: one container, two ports. Public traffic hits Node only; OneDev stays private.
set -euo pipefail

export ONEDEV_INTERNAL_URL="${ONEDEV_INTERNAL_URL:-http://127.0.0.1:6610}"
export PORT="${PORT:-8080}"

# Unattended OneDev first-boot (ignored once /opt/onedev is initialized).
export initial_user="${initial_user:-${ONEDEV_API_USER:-inpact-admin}}"
export initial_password="${initial_password:-${ONEDEV_API_PASS:-inpact-onedev-change-me}}"
export initial_email="${initial_email:-${ONEDEV_INITIAL_EMAIL:-admin@inpact.live}}"
export initial_server_url="${initial_server_url:-${ONEDEV_INITIAL_SERVER_URL:-http://127.0.0.1:6610}}"

export ONEDEV_API_USER="${ONEDEV_API_USER:-$initial_user}"
export ONEDEV_API_PASS="${ONEDEV_API_PASS:-$initial_password}"

echo "[colocated] ONEDEV_INTERNAL_URL=$ONEDEV_INTERNAL_URL"
echo "[colocated] Node PORT=$PORT"
echo "[colocated] OneDev API user=$ONEDEV_API_USER"

onedev_pid=""
term() {
  echo "[colocated] shutting down…"
  if [[ -n "${onedev_pid}" ]] && kill -0 "$onedev_pid" 2>/dev/null; then
    kill -TERM "$onedev_pid" 2>/dev/null || true
    wait "$onedev_pid" 2>/dev/null || true
  fi
  exit 0
}
trap term SIGTERM SIGINT

# Official OneDev image entrypoint (upgrade + wrapper).
/root/bin/entrypoint.sh &
onedev_pid=$!

echo "[colocated] waiting for OneDev on 127.0.0.1:6610…"
ready=0
for i in $(seq 1 90); do
  if curl -sf -o /dev/null "http://127.0.0.1:6610/"; then
    ready=1
    break
  fi
  if ! kill -0 "$onedev_pid" 2>/dev/null; then
    echo "[colocated] OneDev process exited early" >&2
    wait "$onedev_pid" || true
    exit 1
  fi
  sleep 2
done
if [[ "$ready" -ne 1 ]]; then
  echo "[colocated] OneDev did not become ready in time" >&2
  exit 1
fi
echo "[colocated] OneDev is up"

cd /app
# Reserved projects (ids 1–5 on a fresh instance) before FE board / migrate hooks.
node scripts/ensure-onedev-foundation.mjs || echo "[colocated] foundation ensure warned — continuing"

# npm start runs prestart (prisma migrate + FE board ensure) then the API/SPA server.
exec npm start
