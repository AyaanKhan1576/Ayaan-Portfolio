.PHONY: help setup dev test build db-setup backend-check frontend-dev backend-dev frontend-test backend-test frontend-build stop stop-backend stop-frontend clean

help:
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/make-help.ps1

setup:
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup.ps1

dev:
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/dev.ps1

test:
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/test.ps1

build:
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build.ps1

db-setup:
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/db-setup.ps1

backend-check:
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/backend-check.ps1

frontend-dev:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location frontend; if (-not (Test-Path .env)) { Copy-Item .env.example .env }; npm.cmd install; npm.cmd run dev"

backend-dev:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location backend; if (-not (Test-Path .env)) { Copy-Item .env.example .env }; if (-not (Test-Path .venv)) { python -m venv .venv }; .\.venv\Scripts\python.exe -m pip install -r requirements.txt; .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload"

frontend-test:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location frontend; npm.cmd run test"

backend-test:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location backend; .\.venv\Scripts\python.exe -m pytest -p no:cacheprovider"

frontend-build:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location frontend; npm.cmd run build"


stop:
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/stop-services.ps1

stop-backend:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Host 'Stopping backend (python processes)...'; Remove-Item -ErrorAction SilentlyContinue -Path '' | Out-Null; Get-Process -Name python -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }; if ($?) { Write-Host 'Attempted to stop python processes.' }"

stop-frontend:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Host 'Stopping frontend (node processes)...'; Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }; if ($?) { Write-Host 'Attempted to stop node processes.' }"

clean:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item -Recurse -Force frontend/dist, backend/.pytest_cache -ErrorAction SilentlyContinue"
