#!/usr/bin/env bash
# Same-host boot: OneDev on 127.0.0.1:6610 + IPF Node on $PORT (public).
# A tiny health stub listens on $PORT immediately so Railway healthchecks pass
# while OneDev (often slow on first boot) is still starting.
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

# Prefer loopback so Railway does not treat 6610 as a public service port.
export http_host="${http_host:-127.0.0.1}"
export http_port="${http_port:-6610}"

echo "[colocated] ONEDEV_INTERNAL_URL=$ONEDEV_INTERNAL_URL"
echo "[colocated] Node PORT=$PORT"
echo "[colocated] OneDev API user=$ONEDEV_API_USER http_host=$http_host"

onedev_pid=""
health_pid=""
term() {
  echo "[colocated] shutting down…"
  if [[ -n "${health_pid}" ]] && kill -0 "$health_pid" 2>/dev/null; then
    kill -TERM "$health_pid" 2>/dev/null || true
  fi
  if [[ -n "${onedev_pid}" ]] && kill -0 "$onedev_pid" 2>/dev/null; then
    kill -TERM "$onedev_pid" 2>/dev/null || true
    wait "$onedev_pid" 2>/dev/null || true
  fi
  exit 0
}
trap term SIGTERM SIGINT

# Answer Railway healthchecks immediately (before OneDev / npm start).
node --input-type=module -e "
import http from 'node:http';
const port = Number(process.env.PORT || 8080);
http.createServer((_q, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('starting');
}).listen(port, '0.0.0.0', () => console.log('[colocated] health stub on', port));
" &
health_pid=$!

# OneDev requires this path (official image mounts it as a volume). Create it when no
# Railway volume is attached yet so first boot does not die with "Unable to find directory".
mkdir -p /opt/onedev

# If a prior volume has server.properties, force loopback bind.
if [[ -f /opt/onedev/conf/server.properties ]]; then
  sed -i 's/^http_host=.*/http_host=127.0.0.1/' /opt/onedev/conf/server.properties || true
fi

/root/bin/entrypoint.sh &
onedev_pid=$!

echo "[colocated] waiting for OneDev on 127.0.0.1:6610…"
ready=0
for i in $(seq 1 180); do
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
node scripts/ensure-onedev-foundation.mjs || echo "[colocated] foundation ensure warned — continuing"

# Free $PORT for the real app.
if [[ -n "${health_pid}" ]] && kill -0 "$health_pid" 2>/dev/null; then
  kill -TERM "$health_pid" 2>/dev/null || true
  wait "$health_pid" 2>/dev/null || true
  health_pid=""
fi
sleep 1

# npm start runs prestart then the API/SPA server.
exec npm start
