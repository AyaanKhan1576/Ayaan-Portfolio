Write-Host 'Stopping backend and frontend...'

Write-Host 'Stopping backend (python processes)...'
$py = Get-Process -Name python -ErrorAction SilentlyContinue
if ($py) {
    foreach ($p in $py) {
        try {
            Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
            Write-Host "Stopped process Id $($p.Id) : $($p.ProcessName)"
        } catch {
            Write-Warning "Failed to stop $($p.Id): $_"
        }
    }
} else {
    Write-Host 'No python processes found.'
}

Write-Host 'Stopping frontend (node processes)...'
$nd = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nd) {
    foreach ($p in $nd) {
        try {
            Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
            Write-Host "Stopped process Id $($p.Id) : $($p.ProcessName)"
        } catch {
            Write-Warning "Failed to stop $($p.Id): $_"
        }
    }
} else {
    Write-Host 'No node processes found.'
}

Write-Host 'Attempted to stop processes.'
