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

function Stop-ProcessTree {
    param(
        [System.Diagnostics.Process]$Process
    )

    if (-not $Process -or $Process.HasExited) {
        return
    }

    try {
        & taskkill.exe /PID $Process.Id /T /F | Out-Null
    }
    catch {
        Stop-Process -Id $Process.Id -Force -ErrorAction SilentlyContinue
    }
}

& (Join-Path $PSScriptRoot "setup.ps1")
$NpmCmd = Resolve-NpmCmd

function Start-LoggedProcess {
    param(
        [string]$Name,
        [string]$FilePath,
        [string[]]$Arguments,
        [string]$WorkingDirectory
    )

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo.FileName = $FilePath
    if ($Arguments) {
        $process.StartInfo.Arguments = $Arguments -join ' '
    }
    $process.StartInfo.WorkingDirectory = $WorkingDirectory
    $process.StartInfo.UseShellExecute = $false
    $process.StartInfo.RedirectStandardOutput = $true
    $process.StartInfo.RedirectStandardError = $true
    $process.EnableRaisingEvents = $true

    $outputAction = {
        if ($EventArgs.Data) {
            Write-Host "[$($Event.MessageData)] $($EventArgs.Data)"
        }
    }

    Register-ObjectEvent -InputObject $process -EventName OutputDataReceived -Action $outputAction -MessageData $Name | Out-Null
    Register-ObjectEvent -InputObject $process -EventName ErrorDataReceived -Action $outputAction -MessageData $Name | Out-Null

    [void]$process.Start()
    $process.BeginOutputReadLine()
    $process.BeginErrorReadLine()
    return $process
}

Write-Host ""
Write-Host "Starting Ayaan's Room..."
Write-Host "Frontend: http://127.0.0.1:5173"
Write-Host "Backend:  http://127.0.0.1:8000"
Write-Host "Press Ctrl+C to stop both servers."
Write-Host ""

$backendProcess = Start-LoggedProcess `
    -Name "backend" `
    -FilePath (Join-Path $Backend ".venv\Scripts\python.exe") `
    -Arguments @("-m", "uvicorn", "app.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000") `
    -WorkingDirectory $Backend

$frontendProcess = Start-LoggedProcess `
    -Name "frontend" `
    -FilePath $NpmCmd `
    -Arguments @("run", "dev", "--", "--host", "127.0.0.1", "--port", "5173") `
    -WorkingDirectory $Frontend

try {
    while (-not $backendProcess.HasExited -and -not $frontendProcess.HasExited) {
        Start-Sleep -Milliseconds 300
    }
}
finally {
    foreach ($process in @($frontendProcess, $backendProcess)) {
        Stop-ProcessTree $process
    }
    Write-Host "Ayaan's Room stopped."
}
