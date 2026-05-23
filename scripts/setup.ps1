$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Frontend = Join-Path $Root "frontend"
$Backend = Join-Path $Root "backend"

function Resolve-NpmCmd {
    $commands = Get-Command npm.cmd -CommandType Application -All -ErrorAction Stop
    $systemNpm = $commands | Where-Object { $_.Source -notlike "*\node_modules\*" } | Select-Object -First 1
    if (-not $systemNpm) {
        throw "Could not find system npm.cmd. Make sure Node.js is installed and available on PATH."
    }
    return $systemNpm.Source
}

function Copy-EnvIfMissing {
    param(
        [string]$Directory
    )

    $envPath = Join-Path $Directory ".env"
    $examplePath = Join-Path $Directory ".env.example"

    if (-not (Test-Path $envPath) -and (Test-Path $examplePath)) {
        Copy-Item $examplePath $envPath
        Write-Host "Created $envPath from .env.example"
    }
}

$NpmCmd = Resolve-NpmCmd

Write-Host "Preparing environment files..."
Copy-EnvIfMissing $Frontend
Copy-EnvIfMissing $Backend

Write-Host "Installing frontend dependencies..."
Push-Location $Frontend
& $NpmCmd install
Pop-Location

Write-Host "Preparing backend virtual environment..."
Push-Location $Backend
if (-not (Test-Path ".venv")) {
    python -m venv .venv
}
.\.venv\Scripts\python.exe -m pip install --disable-pip-version-check -r requirements.txt
Pop-Location

Write-Host "Setup complete."
