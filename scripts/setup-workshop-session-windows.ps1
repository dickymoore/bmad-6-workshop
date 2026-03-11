#!/usr/bin/env pwsh
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('prepare', 'launch', 'all', 'desktops', 'teardown')]
  [string]$Mode,

  [Parameter(Mandatory = $true)]
  [string]$Session,

  [string]$Distro = 'Ubuntu-24.04',
  [string]$LinuxRepoPath = '/home/codexuser/bmad-6-workshop',

  [ValidatePattern('^[A-Z]$')]
  [string]$DriveLetter = 'W',

  [ValidateRange(0, 999)]
  [int]$MaxBranches = 0,

  [string]$Track,

  [switch]$Reset,
  [switch]$ExcludeMain,
  [switch]$NoCode,
  [switch]$UseVirtualDesktops,
  [switch]$SkipModuleInstall
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

function Get-UncRepoPath {
  $trimmed = $LinuxRepoPath.Trim('/')
  if ([string]::IsNullOrWhiteSpace($trimmed)) {
    return "\\wsl.localhost\\$Distro"
  }

  $windowsRelative = ($trimmed -replace '/', '\')
  return "\\wsl.localhost\\$Distro\\$windowsRelative"
}

function Ensure-GitSafeDirectory {
  param([Parameter(Mandatory = $true)][string]$Path)

  $existing = @(git config --global --get-all safe.directory 2>$null)
  if ($existing -contains $Path) {
    return
  }

  & git config --global --add safe.directory $Path
  if ($LASTEXITCODE -ne 0) {
    Fail "Unable to add git safe.directory entry for $Path"
  }
}

function Ensure-MappedDrive {
  param(
    [Parameter(Mandatory = $true)][string]$Letter,
    [Parameter(Mandatory = $true)][string]$Root
  )

  $driveName = $Letter.TrimEnd(':')
  $drivePath = "${driveName}:"
  $targetRoot = $Root.TrimEnd('\')

  $existing = Get-PSDrive -Name $driveName -PSProvider FileSystem -ErrorAction SilentlyContinue
  if ($existing) {
    $existingRoot = $existing.Root.TrimEnd('\')
    if ($existingRoot -ne $targetRoot) {
      Fail "Drive ${drivePath} is already mapped to $($existing.Root). Unmap it first or choose another -DriveLetter."
    }
    return "${drivePath}\"
  }

  try {
    New-PSDrive -Name $driveName -PSProvider FileSystem -Root $Root -Persist -Scope Global | Out-Null
  } catch {
    Write-Log "New-PSDrive failed for ${drivePath}; falling back to net use"
    & net use "${drivePath}" "$Root" /persistent:no | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Fail "Unable to map ${drivePath} to $Root"
    }
  }

  if (-not (Test-Path -LiteralPath "${drivePath}\")) {
    Fail "Mapped drive ${drivePath} is not accessible after creation"
  }

  return "${drivePath}\"
}

function Ensure-VirtualDesktopModule {
  if (Get-Module -ListAvailable -Name VirtualDesktop) {
    Import-Module VirtualDesktop -ErrorAction Stop
    return
  }

  if ($SkipModuleInstall) {
    Fail 'VirtualDesktop module is not installed and -SkipModuleInstall was supplied.'
  }

  $repo = Get-PSRepository -Name PSGallery -ErrorAction SilentlyContinue
  if ($repo -and $repo.InstallationPolicy -ne 'Trusted') {
    Set-PSRepository -Name PSGallery -InstallationPolicy Trusted
  }

  Install-Module VirtualDesktop -Scope CurrentUser -Force -AllowClobber -ErrorAction Stop
  Import-Module VirtualDesktop -ErrorAction Stop
}

if (-not $IsWindows) {
  Fail 'This wrapper must be run from Windows PowerShell or PowerShell on Windows.'
}

$uncRepoPath = Get-UncRepoPath
if (-not (Test-Path -LiteralPath $uncRepoPath)) {
  Fail "WSL repo path not found: $uncRepoPath"
}

$driveRoot = Ensure-MappedDrive -Letter $DriveLetter -Root $uncRepoPath

$gitSafeUnc = ($uncRepoPath -replace '\\', '/')
$gitSafeDrive = ("{0}:/" -f $DriveLetter.TrimEnd(':'))
Ensure-GitSafeDirectory -Path $gitSafeUnc
Ensure-GitSafeDirectory -Path $gitSafeDrive

if ($Mode -eq 'desktops' -or $UseVirtualDesktops) {
  Ensure-VirtualDesktopModule
}

$innerScript = Join-Path $driveRoot 'scripts\setup-workshop-session.ps1'
if (-not (Test-Path -LiteralPath $innerScript)) {
  Fail "Underlying session script not found: $innerScript"
}

Set-Location $driveRoot

$forwardArgs = @(
  '-Mode', $Mode,
  '-Session', $Session
)

if ($Reset) {
  $forwardArgs += '-Reset'
}
if ($ExcludeMain) {
  $forwardArgs += '-ExcludeMain'
}
if ($NoCode) {
  $forwardArgs += '-NoCode'
}
if ($MaxBranches -gt 0) {
  $forwardArgs += @('-MaxBranches', $MaxBranches.ToString())
}
if (-not [string]::IsNullOrWhiteSpace($Track)) {
  $forwardArgs += @('-Track', $Track)
}
if ($UseVirtualDesktops -and ($Mode -eq 'all' -or $Mode -eq 'launch')) {
  $forwardArgs += '-UseVirtualDesktops'
}

Write-Log "using repo drive ${DriveLetter}: -> $uncRepoPath"
Write-Log "running $innerScript $($forwardArgs -join ' ')"

& $innerScript @forwardArgs
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
