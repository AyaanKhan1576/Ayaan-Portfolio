$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$SchemaPath = Join-Path $Root "docs\supabase_schema.sql"
$BackendEnvPath = Join-Path $Root "backend\.env"

function Read-EnvValue {
    param(
        [string]$Path,
        [string]$Name
    )

    if (-not (Test-Path $Path)) {
        return ""
    }

    $line = Get-Content $Path | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
    if (-not $line) {
        return ""
    }

    return ($line -replace "^$Name=", "").Trim()
}

$DatabaseUrl = $env:DATABASE_URL
if (-not $DatabaseUrl) {
    $DatabaseUrl = Read-EnvValue -Path $BackendEnvPath -Name "DATABASE_URL"
}

if (-not $DatabaseUrl) {
    Write-Host "DATABASE_URL is not configured."
    Write-Host "Open Supabase SQL Editor and run:"
    Write-Host "  $SchemaPath"
    Write-Host ""
    Write-Host "To run this command automatically, set backend/.env DATABASE_URL to the Supabase Postgres connection string."
    exit 0
}

$Psql = Get-Command psql -CommandType Application -ErrorAction SilentlyContinue
if (-not $Psql) {
    Write-Host "psql was not found on PATH."
    Write-Host "Install PostgreSQL tools, or run this schema manually in Supabase SQL Editor:"
    Write-Host "  $SchemaPath"
    exit 1
}

Write-Host "Applying Supabase schema..."
& $Psql.Source $DatabaseUrl -f $SchemaPath
if ($LASTEXITCODE -ne 0) {
    throw "psql failed with exit code $LASTEXITCODE."
}
Write-Host "Database schema applied."
