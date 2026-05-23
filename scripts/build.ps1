$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot

function Resolve-NpmCmd {
    $commands = Get-Command npm.cmd -CommandType Application -All -ErrorAction Stop
    $systemNpm = $commands | Where-Object { $_.Source -notlike "*\node_modules\*" } | Select-Object -First 1
    if (-not $systemNpm) {
        throw "Could not find system npm.cmd. Make sure Node.js is installed and available on PATH."
    }
    return $systemNpm.Source
}

& (Join-Path $PSScriptRoot "setup.ps1")
$NpmCmd = Resolve-NpmCmd

Write-Host "Building frontend..."
Push-Location (Join-Path $Root "frontend")
& $NpmCmd run build
Pop-Location

Write-Host "Checking backend tests..."
Push-Location (Join-Path $Root "backend")
.\.venv\Scripts\python.exe -m pytest -p no:cacheprovider
Pop-Location
