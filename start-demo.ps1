# start-demo.ps1 - one command to bring up everything the Inpact / MiniERP demo needs.
# Run this before any live demo or YC interview. Safe to re-run - every step is idempotent
# (Docker reuses existing containers, npm/pnpm just start already-installed deps).

$ErrorActionPreference = "Continue"
$logDir = "D:\IPAAL\.demo-logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

function Wait-Port($port, $name, $timeoutSec = 30) {
    Write-Host "Waiting for $name on port $port..." -NoNewline
    $elapsed = 0
    while ($elapsed -lt $timeoutSec) {
        $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($conn) { Write-Host " up." -ForegroundColor Green; return $true }
        Start-Sleep -Seconds 1
        $elapsed++
    }
    Write-Host " TIMED OUT after $timeoutSec s." -ForegroundColor Red
    return $false
}

function Start-Shim($cmd, $cmdArgs, $workDir, $outLog, $errLog) {
    # npm/pnpm are .cmd shims on Windows - Start-Process can't exec them directly
    # ("%1 is not a valid Win32 application"). Route through cmd.exe /c instead.
    Start-Process cmd.exe -ArgumentList "/c $cmd $cmdArgs" -WorkingDirectory $workDir -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errLog
}

Write-Host ""
Write-Host "== 0/5: Docker Desktop ==" -ForegroundColor Cyan
$dockerUp = docker info 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker daemon not responding - starting Docker Desktop..." -NoNewline
    $dockerExe = "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
    if (-not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
        Start-Process $dockerExe
    }
    $elapsed = 0
    while ($elapsed -lt 90) {
        docker info *> $null
        if ($LASTEXITCODE -eq 0) { Write-Host " up." -ForegroundColor Green; break }
        Start-Sleep -Seconds 3
        $elapsed += 3
    }
    if ($elapsed -ge 90) { Write-Host " TIMED OUT after 90s - Docker Desktop may need a manual first-run/login." -ForegroundColor Red }
} else {
    Write-Host "Already running." -ForegroundColor Green
}

Write-Host ""
Write-Host "== 1/5: OneDev (git plus issues) ==" -ForegroundColor Cyan
$onedev = docker ps --filter "name=onedev-inpact" --format "{{.Status}}"
if ($onedev) { Write-Host "Already running: $onedev" -ForegroundColor Green }
else {
    Write-Host "onedev-inpact container not found or Docker not ready - start it manually (docker start onedev-inpact)." -ForegroundColor Red
}

Write-Host ""
Write-Host "== 2/5: Mini ERP database and queue (Postgres, Redis) ==" -ForegroundColor Cyan
Push-Location "D:\IPAAL\mini-erp"
docker compose up -d
Pop-Location
Wait-Port 5433 "Postgres (Mini ERP)" | Out-Null
Wait-Port 6379 "Redis" | Out-Null

Write-Host ""
Write-Host "== 3/5: Mini ERP API and reorder worker ==" -ForegroundColor Cyan
$apiRunning = Get-NetTCPConnection -LocalPort 4100 -State Listen -ErrorAction SilentlyContinue
if (-not $apiRunning) {
    Start-Shim "pnpm" "run dev" "D:\IPAAL\mini-erp\apps\api" "$logDir\erp-api.log" "$logDir\erp-api.err.log"
    Start-Shim "pnpm" "run worker" "D:\IPAAL\mini-erp\apps\api" "$logDir\erp-worker.log" "$logDir\erp-worker.err.log"
} else {
    Write-Host "API already running on 4100." -ForegroundColor Green
}
Wait-Port 4100 "Mini ERP API" | Out-Null

Write-Host ""
Write-Host "== 4/5: Inpact server (auth, matching, git proxy) ==" -ForegroundColor Cyan
$serverRunning = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
if (-not $serverRunning) {
    Start-Shim "npm" "run server" "D:\IPAAL" "$logDir\ipf-server.log" "$logDir\ipf-server.err.log"
} else {
    Write-Host "Already running on 3001." -ForegroundColor Green
}
Wait-Port 3001 "Inpact server" | Out-Null

Write-Host ""
Write-Host "== 5/5: Inpact web app (Vite) ==" -ForegroundColor Cyan
$viteRunning = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if (-not $viteRunning) {
    Start-Shim "npm" "run dev" "D:\IPAAL" "$logDir\ipf-vite.log" "$logDir\ipf-vite.err.log"
} else {
    Write-Host "Already running on 5173." -ForegroundColor Green
}
Wait-Port 5173 "Vite" | Out-Null

Write-Host ""
Write-Host "Ready. Open http://localhost:5173" -ForegroundColor Green
Write-Host "Logs: $logDir (if anything looks off, check the .err.log files first)"
Write-Host ""
