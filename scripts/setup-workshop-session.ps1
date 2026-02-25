#!/usr/bin/env pwsh
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('prepare', 'launch', 'all', 'teardown')]
  [string]$Mode,

  [Parameter(Mandatory = $true)]
  [string]$Session,

  [string]$SessionsRoot,
  [string]$SourceRepo,

  [switch]$ExcludeMain,
  [switch]$NoCode,
  [switch]$Reset,
  [switch]$UseVirtualDesktops
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Log {
  param([string]$Message)
  $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  Write-Host "[$timestamp] $Message"
}

function Fail {
  param([string]$Message)
  throw $Message
}

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments,

    [switch]$AllowFailure,
    [switch]$SuppressOutput
  )

  if ($SuppressOutput) {
    & git @Arguments *> $null
  } else {
    & git @Arguments
  }

  if (-not $AllowFailure -and $LASTEXITCODE -ne 0) {
    Fail "git command failed (exit $LASTEXITCODE): git $($Arguments -join ' ')"
  }

  if ($AllowFailure) {
    return $LASTEXITCODE
  }
}

function Get-DefaultSourceRepo {
  $scriptDir = Split-Path -Parent $PSCommandPath
  try {
    $repo = (& git -C (Join-Path $scriptDir '..') rev-parse --show-toplevel).Trim()
    if ([string]::IsNullOrWhiteSpace($repo)) {
      return (Resolve-Path (Join-Path $scriptDir '..')).Path
    }
    return $repo
  } catch {
    return (Resolve-Path (Join-Path $scriptDir '..')).Path
  }
}

function Get-BranchEntries {
  $entries = @(
    [PSCustomObject]@{ Branch = 'main'; Folder = '00-main' }
    [PSCustomObject]@{ Branch = 'workshop/10-analysis'; Folder = '10-analysis' }
    [PSCustomObject]@{ Branch = 'workshop/20-planning'; Folder = '20-planning' }
    [PSCustomObject]@{ Branch = 'workshop/30-solutioning'; Folder = '30-solutioning' }
    [PSCustomObject]@{ Branch = 'workshop/40-implementation-setup'; Folder = '40-implementation-setup' }
    [PSCustomObject]@{ Branch = 'workshop/50-ready-for-dev'; Folder = '50-ready-for-dev' }
    [PSCustomObject]@{ Branch = 'workshop/60-implementation'; Folder = '60-implementation' }
    [PSCustomObject]@{ Branch = 'workshop/70-complete'; Folder = '70-complete' }
    [PSCustomObject]@{ Branch = 'workshop/80-mvp'; Folder = '80-mvp' }
  )

  if ($ExcludeMain) {
    return $entries | Where-Object { $_.Branch -ne 'main' }
  }

  return $entries
}

function Get-SessionPath {
  return Join-Path $SessionsRoot $Session
}

function Get-MirrorPath {
  return Join-Path (Get-SessionPath) '.mirror.git'
}

function Get-ManifestPath {
  return Join-Path (Get-SessionPath) '.session-manifest.json'
}

function Sync-SourceRepo {
  $hasOrigin = $true
  try {
    $null = (& git -C $SourceRepo remote get-url origin).Trim()
  } catch {
    $hasOrigin = $false
  }

  if ($hasOrigin) {
    Write-Log 'fetching latest refs into source repo from origin'
    Invoke-Git -Arguments @('-C', $SourceRepo, 'fetch', 'origin', '--prune') -SuppressOutput
  } else {
    Write-Log 'source repo has no origin remote; using local refs only'
  }
}

function Resolve-MirrorRef {
  param(
    [Parameter(Mandatory = $true)]
    [string]$MirrorPath,
    [Parameter(Mandatory = $true)]
    [string]$Branch
  )

  $remoteRef = "refs/remotes/origin/$Branch"
  $localRef = "refs/heads/$Branch"

  $remoteExists = Invoke-Git -Arguments @("--git-dir=$MirrorPath", 'show-ref', '--verify', '--quiet', $remoteRef) -AllowFailure -SuppressOutput
  if ($remoteExists -eq 0) {
    return $remoteRef
  }

  $localExists = Invoke-Git -Arguments @("--git-dir=$MirrorPath", 'show-ref', '--verify', '--quiet', $localRef) -AllowFailure -SuppressOutput
  if ($localExists -eq 0) {
    return $localRef
  }

  Fail "Branch not found in source refs: $Branch"
}

function Assert-SourceRepo {
  if (-not (Test-Path -LiteralPath $SourceRepo)) {
    Fail "Source repo path does not exist: $SourceRepo"
  }

  Invoke-Git -Arguments @('-C', $SourceRepo, 'rev-parse', '--is-inside-work-tree') -SuppressOutput
}

function Write-Manifest {
  param([array]$Entries)

  $sessionPath = Get-SessionPath
  $manifestPath = Get-ManifestPath

  $items = foreach ($entry in $Entries) {
    [PSCustomObject]@{
      branch = $entry.Branch
      folder = $entry.Folder
      path = (Join-Path $sessionPath $entry.Folder)
    }
  }

  $manifest = [PSCustomObject]@{
    session = $Session
    createdAtUtc = (Get-Date).ToUniversalTime().ToString('o')
    sourceRepo = (Resolve-Path $SourceRepo).Path
    includeMain = (-not $ExcludeMain)
    items = $items
  }

  $manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath
}

function Prepare-Session {
  $sessionPath = Get-SessionPath
  $mirrorPath = Get-MirrorPath
  $entries = Get-BranchEntries

  if ($Reset -and (Test-Path -LiteralPath $sessionPath)) {
    Write-Log "reset enabled: removing existing session folder: $sessionPath"
    Remove-Item -LiteralPath $sessionPath -Recurse -Force
  }

  if (-not (Test-Path -LiteralPath $sessionPath)) {
    New-Item -ItemType Directory -Path $sessionPath | Out-Null
  }

  Sync-SourceRepo

  if (-not (Test-Path -LiteralPath $mirrorPath)) {
    Write-Log "creating mirror repository: $mirrorPath"
    Invoke-Git -Arguments @('clone', '--mirror', $SourceRepo, $mirrorPath)
  }

  Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'remote', 'set-url', 'origin', $SourceRepo)
  Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'fetch', 'origin', '--prune') -SuppressOutput
  Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'worktree', 'prune') -SuppressOutput

  foreach ($entry in $entries) {
    $branch = $entry.Branch
    $folderPath = Join-Path $sessionPath $entry.Folder
    $headRef = "refs/heads/$branch"
    $sourceRef = Resolve-MirrorRef -MirrorPath $mirrorPath -Branch $branch

    if (Test-Path -LiteralPath $folderPath) {
      Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'worktree', 'remove', '--force', $folderPath) -AllowFailure -SuppressOutput | Out-Null
      if (Test-Path -LiteralPath $folderPath) {
        Remove-Item -LiteralPath $folderPath -Recurse -Force
      }
    }

    Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'update-ref', $headRef, $sourceRef)
    Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'worktree', 'add', '--force', $folderPath, $branch) -SuppressOutput
    Invoke-Git -Arguments @('-C', $folderPath, 'reset', '--hard', $branch) -SuppressOutput
    Invoke-Git -Arguments @('-C', $folderPath, 'clean', '-fd') -SuppressOutput

    Write-Log "prepared $branch -> $folderPath"
  }

  Write-Manifest -Entries $entries
  Write-Log "session prepared: $sessionPath"
}

function Get-SessionItems {
  $manifestPath = Get-ManifestPath
  if (-not (Test-Path -LiteralPath $manifestPath)) {
    Fail "Session manifest missing: $manifestPath (run prepare first)"
  }

  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
  return @($manifest.items)
}

function Open-CodeWindow {
  param([string]$Path)

  $codeCmd = Get-Command code -ErrorAction SilentlyContinue
  if (-not $codeCmd) {
    Fail "VS Code CLI 'code' not found in PATH"
  }

  Start-Process -FilePath $codeCmd.Source -ArgumentList @('-n', $Path) | Out-Null
}

function Test-VirtualDesktopSupport {
  $newDesktop = Get-Command New-Desktop -ErrorAction SilentlyContinue
  $switchDesktop = Get-Command Switch-Desktop -ErrorAction SilentlyContinue
  return ($null -ne $newDesktop -and $null -ne $switchDesktop)
}

function Switch-ToDesktop {
  param(
    [object]$Desktop,
    [int]$Index
  )

  $switchCmd = Get-Command Switch-Desktop -ErrorAction Stop
  if ($switchCmd.Parameters.ContainsKey('Desktop')) {
    Switch-Desktop -Desktop $Desktop | Out-Null
    return
  }

  if ($switchCmd.Parameters.ContainsKey('Number')) {
    Switch-Desktop -Number $Index | Out-Null
    return
  }

  & $switchCmd.Source $Desktop | Out-Null
}

function Launch-Session {
  $items = Get-SessionItems

  if ($NoCode) {
    Write-Log '--no-code enabled; skipping VS Code launch'
    return
  }

  $desktopControlEnabled = $UseVirtualDesktops -and (Test-VirtualDesktopSupport)
  if ($UseVirtualDesktops -and -not $desktopControlEnabled) {
    Write-Warning 'Virtual desktop commands not found. Install/import a compatible module (for example VirtualDesktop) and retry.'
  }

  $desktopIndex = 0
  foreach ($item in $items) {
    $path = $item.path
    if (-not (Test-Path -LiteralPath $path)) {
      Fail "Missing branch folder for launch: $path"
    }

    if ($desktopControlEnabled) {
      try {
        $desktop = New-Desktop
        Switch-ToDesktop -Desktop $desktop -Index $desktopIndex
        Start-Sleep -Milliseconds 300
      } catch {
        Write-Warning "Virtual desktop step failed; continuing without desktop control. $($_.Exception.Message)"
        $desktopControlEnabled = $false
      }
      $desktopIndex++
    }

    Write-Log "opening VS Code for $($item.branch) ($path)"
    Open-CodeWindow -Path $path
    Start-Sleep -Milliseconds 300
  }
}

function Close-CodeWindowsForSession {
  $sessionPath = Get-SessionPath

  if (-not $IsWindows) {
    return
  }

  try {
    $pattern = [Regex]::Escape($sessionPath)
    $processes = Get-CimInstance Win32_Process -Filter "Name='Code.exe'"
    foreach ($process in $processes) {
      if ($process.CommandLine -and $process.CommandLine -match $pattern) {
        Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
      }
    }
  } catch {
    Write-Warning "Unable to close VS Code windows automatically: $($_.Exception.Message)"
  }
}

function Teardown-Session {
  $sessionPath = Get-SessionPath

  if (-not (Test-Path -LiteralPath $sessionPath)) {
    Write-Log "nothing to teardown; session folder not found: $sessionPath"
    return
  }

  Close-CodeWindowsForSession
  Remove-Item -LiteralPath $sessionPath -Recurse -Force
  Write-Log "session removed: $sessionPath"
}

$defaultSourceRepo = Get-DefaultSourceRepo
if ([string]::IsNullOrWhiteSpace($SourceRepo)) {
  $SourceRepo = $defaultSourceRepo
}
if ([string]::IsNullOrWhiteSpace($SessionsRoot)) {
  $SessionsRoot = Join-Path $defaultSourceRepo 'workshop-sessions'
}

Assert-SourceRepo
if (-not (Test-Path -LiteralPath $SessionsRoot)) {
  New-Item -ItemType Directory -Path $SessionsRoot | Out-Null
}

switch ($Mode) {
  'prepare' { Prepare-Session }
  'launch' { Launch-Session }
  'all' {
    Prepare-Session
    Launch-Session
  }
  'teardown' { Teardown-Session }
}
