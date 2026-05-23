$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"

Push-Location $Backend
try {
    if (-not (Test-Path ".venv")) {
        throw "Backend virtual environment not found. Run make setup first."
    }

    .\.venv\Scripts\python.exe -c "from app.services.system_service import SystemService; import json; print(json.dumps(SystemService().readiness(), indent=2))"
}
finally {
    Pop-Location
}
