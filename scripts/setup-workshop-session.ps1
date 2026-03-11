#!/usr/bin/env pwsh
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('prepare', 'launch', 'desktops', 'all', 'teardown')]
  [string]$Mode,

  [Parameter(Mandatory = $true)]
  [string]$Session,

  [string]$SessionsRoot,
  [string]$SourceRepo,

  [switch]$ExcludeMain,
  [switch]$NoCode,
  [switch]$Reset,
[switch]$UseVirtualDesktops,

  [ValidateRange(0, 999)]
  [int]$MaxBranches = 0
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
    $entries = @($entries | Where-Object { $_.Branch -ne 'main' })
  }

  if ($MaxBranches -gt 0) {
    $entries = @($entries | Select-Object -First $MaxBranches)
  }

  return @($entries)
}

function Get-SourceBranchAlias {
  param([Parameter(Mandatory = $true)][string]$Branch)

  $aliases = @{
    'workshop/10-analysis' = 'stage-1'
    'workshop/20-planning' = 'stage-2'
    'workshop/30-solutioning' = 'stage-3'
    'workshop/40-implementation-setup' = 'stage-4'
    'workshop/50-ready-for-dev' = 'ready-for-dev'
    'workshop/60-implementation' = 'implementation-in-progress'
    'workshop/70-complete' = 'complete'
    'workshop/80-mvp' = 'mvp'
  }

  if ($aliases.ContainsKey($Branch)) {
    return $aliases[$Branch]
  }

  return $null
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

function Copy-FileIfExists {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$Destination
  )

  if (Test-Path -LiteralPath $Source -PathType Leaf) {
    Copy-Item -LiteralPath $Source -Destination $Destination -Force
    return $true
  }

  return $false
}

function Copy-DirectoryIfExists {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$Destination
  )

  if (Test-Path -LiteralPath $Source -PathType Container) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $Source '*') -Destination $Destination -Recurse -Force
    return $true
  }

  return $false
}

function Ensure-VSCodeCodexEnv {
  param([Parameter(Mandatory = $true)][string]$BranchPath)

  $vscodePath = Join-Path $BranchPath '.vscode'
  $settingsPath = Join-Path $vscodePath 'settings.json'
  $tasksPath = Join-Path $vscodePath 'tasks.json'
  New-Item -ItemType Directory -Path $vscodePath -Force | Out-Null

  $settings = @{}
  if (Test-Path -LiteralPath $settingsPath -PathType Leaf) {
    try {
      $raw = Get-Content -LiteralPath $settingsPath -Raw
      if (-not [string]::IsNullOrWhiteSpace($raw)) {
        $parsed = ConvertFrom-Json -InputObject $raw -AsHashtable
        if ($parsed -is [hashtable]) {
          $settings = $parsed
        }
      }
    } catch {
      Write-Warning "Unable to parse $settingsPath; skipping CODEX_HOME terminal env injection."
      return
    }
  }

  if (-not $settings.ContainsKey('terminal.integrated.env.linux') -or -not ($settings['terminal.integrated.env.linux'] -is [hashtable])) {
    $settings['terminal.integrated.env.linux'] = @{}
  }
  if (-not $settings.ContainsKey('terminal.integrated.env.windows') -or -not ($settings['terminal.integrated.env.windows'] -is [hashtable])) {
    $settings['terminal.integrated.env.windows'] = @{}
  }

  $settings['terminal.integrated.env.linux']['CODEX_HOME'] = '${workspaceFolder}/.codex'
  $settings['terminal.integrated.env.windows']['CODEX_HOME'] = '${workspaceFolder}\.codex'
  $settings['task.allowAutomaticTasks'] = 'on'
  $settings['terminal.integrated.hideOnStartup'] = 'never'
  $settings['workbench.panel.defaultLocation'] = 'right'

  $settings | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $settingsPath

  $tasks = @{
    version = '2.0.0'
    tasks = @(
      @{
        label = 'Workshop: Start Codex'
        type = 'shell'
        command = 'codex --yolo'
        windows = @{
          command = 'wsl.exe bash -lc ''cd "$(wslpath -a "${workspaceFolder}")" && CODEX_HOME="$PWD/.codex" codex --yolo'''
        }
        options = @{
          cwd = '${workspaceFolder}'
          env = @{
            CODEX_HOME = '${workspaceFolder}/.codex'
          }
        }
        problemMatcher = @()
        presentation = @{
          reveal = 'always'
          focus = $true
          panel = 'dedicated'
          clear = $false
          showReuseMessage = $false
        }
        runOptions = @{
          runOn = 'folderOpen'
          instanceLimit = 1
        }
      }
    )
  }

  $tasks | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $tasksPath
}

function Ensure-WorktreeExcludes {
  param([Parameter(Mandatory = $true)][string]$BranchPath)

  $excludePath = ''
  try {
    $excludePath = (& git -C $BranchPath rev-parse --git-path info/exclude).Trim()
  } catch {
    Write-Warning "Unable to determine git exclude path for $BranchPath"
    return
  }

  if ([string]::IsNullOrWhiteSpace($excludePath)) {
    return
  }

  $excludeDir = Split-Path -Parent $excludePath
  if (-not (Test-Path -LiteralPath $excludeDir)) {
    New-Item -ItemType Directory -Path $excludeDir -Force | Out-Null
  }

  if (-not (Test-Path -LiteralPath $excludePath -PathType Leaf)) {
    New-Item -ItemType File -Path $excludePath -Force | Out-Null
  }

  $entries = @('.codex/', '.vscode/settings.json', '.vscode/tasks.json', '.agents/', '_bmad/', '_bmad-output/')
  $existing = @()
  if (Test-Path -LiteralPath $excludePath -PathType Leaf) {
    $existing = @(Get-Content -LiteralPath $excludePath -ErrorAction SilentlyContinue)
  }

  foreach ($entry in $entries) {
    if ($existing -notcontains $entry) {
      Add-Content -LiteralPath $excludePath -Value $entry
    }
  }
}

function Protect-CodexSecrets {
  param([Parameter(Mandatory = $true)][string]$CodexPath)

  $targets = @(
    (Join-Path $CodexPath 'auth.json'),
    (Join-Path $CodexPath 'config.toml')
  )

  foreach ($target in $targets) {
    if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
      continue
    }

    try {
      if ($IsWindows) {
        $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
        & icacls $target /inheritance:r /grant:r "${identity}:(R,W)" /c *> $null
      } else {
        & chmod 600 $target
      }
    } catch {
      Write-Warning "Unable to tighten permissions on $target"
    }
  }
}

function Sync-SystemSkills {
  param(
    [Parameter(Mandatory = $true)][string]$CodexSkillsPath,
    [Parameter(Mandatory = $true)][string]$SourceRepoPath
  )

  $candidates = @(
    (Join-Path $SourceRepoPath '.codex/skills/.system'),
    (Join-Path $HOME '.codex/skills/.system')
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate -PathType Container) {
      $dest = Join-Path $CodexSkillsPath '.system'
      if (Test-Path -LiteralPath $dest) {
        Remove-Item -LiteralPath $dest -Recurse -Force
      }
      Copy-Item -LiteralPath $candidate -Destination $dest -Recurse -Force
      return
    }
  }
}

function Get-BmadBundlePath {
  return Join-Path (Get-SessionPath) '.bmad-codex-bundle'
}

function Resolve-BmadUserName {
  if (-not [string]::IsNullOrWhiteSpace($env:USERNAME)) {
    return ($env:USERNAME -replace '\s+', '-')
  }

  if (-not [string]::IsNullOrWhiteSpace($env:USER)) {
    return ($env:USER -replace '\s+', '-')
  }

  return 'codexuser'
}

function Ensure-BmadBundle {
  $bundlePath = Get-BmadBundlePath
  $bundleConfig = Join-Path $bundlePath '_bmad'
  $bundleSkills = Join-Path $bundlePath '.agents/skills'

  if ((Test-Path -LiteralPath $bundleConfig -PathType Container) -and (Test-Path -LiteralPath $bundleSkills -PathType Container)) {
    return
  }

  if (Test-Path -LiteralPath $bundlePath) {
    Remove-Item -LiteralPath $bundlePath -Recurse -Force
  }
  New-Item -ItemType Directory -Path $bundlePath -Force | Out-Null

  $sourceBmad = Join-Path $SourceRepo '_bmad'
  $sourceAgents = Join-Path $SourceRepo '.agents'
  $sourceOutput = Join-Path $SourceRepo '_bmad-output'

  if ((Test-Path -LiteralPath $sourceBmad -PathType Container) -and (Test-Path -LiteralPath (Join-Path $sourceAgents 'skills') -PathType Container)) {
    Write-Log 'copying BMAD Codex payload from source repo into session bundle cache'
    $null = Copy-DirectoryIfExists -Source $sourceBmad -Destination (Join-Path $bundlePath '_bmad')
    $null = Copy-DirectoryIfExists -Source $sourceAgents -Destination (Join-Path $bundlePath '.agents')
    $null = Copy-DirectoryIfExists -Source $sourceOutput -Destination (Join-Path $bundlePath '_bmad-output')
  } else {
    if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
      Fail 'npx is required to provision BMAD Codex skills'
    }

    $userName = Resolve-BmadUserName
    Write-Log 'installing BMAD stable v6 bundle into session cache via npx bmad-method@latest'
    & npx 'bmad-method@latest' install `
      --directory $bundlePath `
      --action install `
      --yes `
      --modules bmm `
      --tools codex `
      --user-name $userName `
      --output-folder _bmad-output *> $null

    if ($LASTEXITCODE -ne 0) {
      Fail 'Unable to install BMAD stable bundle for session bootstrap'
    }
  }

  if (-not ((Test-Path -LiteralPath $bundleConfig -PathType Container) -and (Test-Path -LiteralPath $bundleSkills -PathType Container))) {
    Fail "BMAD session bundle is incomplete: expected _bmad and .agents/skills in $bundlePath"
  }
}

function Provision-BmadPayload {
  param([Parameter(Mandatory = $true)][string]$BranchPath)

  $branchBmad = Join-Path $BranchPath '_bmad'
  $branchSkills = Join-Path $BranchPath '.agents/skills'

  if ((Test-Path -LiteralPath $branchBmad -PathType Container) -and (Test-Path -LiteralPath $branchSkills -PathType Container)) {
    return
  }

  Ensure-BmadBundle
  $bundlePath = Get-BmadBundlePath

  if (-not (Test-Path -LiteralPath $branchBmad -PathType Container)) {
    $null = Copy-DirectoryIfExists -Source (Join-Path $bundlePath '_bmad') -Destination $branchBmad
  }
  if (-not (Test-Path -LiteralPath $branchSkills -PathType Container)) {
    $null = Copy-DirectoryIfExists -Source (Join-Path $bundlePath '.agents') -Destination (Join-Path $BranchPath '.agents')
  }
  if (-not (Test-Path -LiteralPath (Join-Path $BranchPath '_bmad-output') -PathType Container)) {
    $null = Copy-DirectoryIfExists -Source (Join-Path $bundlePath '_bmad-output') -Destination (Join-Path $BranchPath '_bmad-output')
  }
}

function Sync-BmadSkills {
  param([Parameter(Mandatory = $true)][string]$BranchPath)

  $skillsPath = Join-Path $BranchPath '.codex/skills'
  $agentsSkillsPath = Join-Path $BranchPath '.agents/skills'
  New-Item -ItemType Directory -Path $skillsPath -Force | Out-Null

  # Keep .system intact; rebuild BMAD skills to match this branch.
  Get-ChildItem -LiteralPath $skillsPath -Force -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.Name -ne '.system') {
      Remove-Item -LiteralPath $_.FullName -Recurse -Force
    }
  }

  if (-not (Test-Path -LiteralPath $agentsSkillsPath -PathType Container)) {
    Write-Log "no .agents/skills found in $BranchPath; BMAD skills unavailable for this branch"
    return
  }

  Get-ChildItem -LiteralPath $agentsSkillsPath -Directory | ForEach-Object {
    $dest = Join-Path $skillsPath $_.Name
    Copy-Item -LiteralPath $_.FullName -Destination $dest -Recurse -Force
  }
}

function Apply-BmadCodexCompatibility {
  param([Parameter(Mandatory = $true)][string]$BranchPath)

  $helpTask = Join-Path $BranchPath '_bmad/core/tasks/help.md'
  $helpSkill = Join-Path $BranchPath '.codex/skills/bmad-help/SKILL.md'

  if (Test-Path -LiteralPath $helpTask -PathType Leaf) {
    $taskContent = Get-Content -LiteralPath $helpTask -Raw
    if ($taskContent -notmatch '## CODEX COMPATIBILITY OVERRIDE') {
      $override = @'
## CODEX COMPATIBILITY OVERRIDE
- This section overrides conflicting display rules below.
- BMAD workflows in Codex are invoked as skills, not legacy `/bmad-*` slash commands.
- When showing a workflow command from the catalog, output `$<command>` (example: `$bmad-bmm-create-prd`).
- For help itself, always show `$bmad-help` (never `/bmad-help`).
- For agent workflows, direct users to `/skills` and pick the relevant agent skill.
- If legacy slash syntax appears in source docs, label it as legacy and include the `$...` equivalent.
'@
      if ($taskContent -match '(?m)^# Task: BMAD Help$') {
        $taskContent = [regex]::Replace(
          $taskContent,
          '(?m)^# Task: BMAD Help$',
          "# Task: BMAD Help`n`n$override",
          1
        )
      } else {
        $taskContent = "$override`n`n$taskContent"
      }
      Set-Content -LiteralPath $helpTask -Value $taskContent
    }
  }

  if (Test-Path -LiteralPath $helpSkill -PathType Leaf) {
    $skillContent = Get-Content -LiteralPath $helpSkill -Raw
    if ($skillContent -notmatch '## CODEX COMPATIBILITY OVERRIDE') {
      $append = @'

## CODEX COMPATIBILITY OVERRIDE

- BMAD entries that look like `/bmad-*` are legacy slash syntax.
- In Codex, invoke BMAD workflows as skills with `$bmad-*`.
- Apply this mapping when presenting next-step recommendations.
'@
      Set-Content -LiteralPath $helpSkill -Value ($skillContent.TrimEnd("`r", "`n") + $append + "`n")
    }
  }
}

function Bootstrap-CodexWorkspace {
  param([Parameter(Mandatory = $true)][string]$BranchPath)

  $codexPath = Join-Path $BranchPath '.codex'
  $skillsPath = Join-Path $codexPath 'skills'
  New-Item -ItemType Directory -Path $skillsPath -Force | Out-Null

  $copiedAuth = $false
  $copiedAuth = Copy-FileIfExists -Source (Join-Path $SourceRepo '.codex/auth.json') -Destination (Join-Path $codexPath 'auth.json')
  if (-not $copiedAuth) {
    $copiedAuth = Copy-FileIfExists -Source (Join-Path $HOME '.codex/auth.json') -Destination (Join-Path $codexPath 'auth.json')
  }

  $copiedConfig = Copy-FileIfExists -Source (Join-Path $SourceRepo '.codex/config.toml') -Destination (Join-Path $codexPath 'config.toml')
  if (-not $copiedConfig) {
    $null = Copy-FileIfExists -Source (Join-Path $HOME '.codex/config.toml') -Destination (Join-Path $codexPath 'config.toml')
  }

  Sync-SystemSkills -CodexSkillsPath $skillsPath -SourceRepoPath $SourceRepo
  Provision-BmadPayload -BranchPath $BranchPath
  Sync-BmadSkills -BranchPath $BranchPath
  Apply-BmadCodexCompatibility -BranchPath $BranchPath
  Ensure-VSCodeCodexEnv -BranchPath $BranchPath
  Ensure-WorktreeExcludes -BranchPath $BranchPath
  Protect-CodexSecrets -CodexPath $codexPath

  if ($copiedAuth) {
    Write-Log "bootstrapped Codex workspace in $BranchPath/.codex"
  } else {
    Write-Log "bootstrapped Codex workspace in $BranchPath/.codex (no auth.json source found)"
  }
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
  $aliasBranch = Get-SourceBranchAlias -Branch $Branch

  $remoteExists = Invoke-Git -Arguments @("--git-dir=$MirrorPath", 'show-ref', '--verify', '--quiet', $remoteRef) -AllowFailure -SuppressOutput
  if ($remoteExists -eq 0) {
    return $remoteRef
  }

  $localExists = Invoke-Git -Arguments @("--git-dir=$MirrorPath", 'show-ref', '--verify', '--quiet', $localRef) -AllowFailure -SuppressOutput
  if ($localExists -eq 0) {
    return $localRef
  }

  if (-not [string]::IsNullOrWhiteSpace($aliasBranch)) {
    $aliasRemoteRef = "refs/remotes/origin/$aliasBranch"
    $aliasLocalRef = "refs/heads/$aliasBranch"

    $aliasRemoteExists = Invoke-Git -Arguments @("--git-dir=$MirrorPath", 'show-ref', '--verify', '--quiet', $aliasRemoteRef) -AllowFailure -SuppressOutput
    if ($aliasRemoteExists -eq 0) {
      return $aliasRemoteRef
    }

    $aliasLocalExists = Invoke-Git -Arguments @("--git-dir=$MirrorPath", 'show-ref', '--verify', '--quiet', $aliasLocalRef) -AllowFailure -SuppressOutput
    if ($aliasLocalExists -eq 0) {
      return $aliasLocalRef
    }
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
  # Avoid mirror-style fetch into refs/heads/*, which fails when a branch is
  # checked out in an attached worktree (for example 00-main).
  Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'config', '--unset-all', 'remote.origin.fetch') -AllowFailure -SuppressOutput | Out-Null
  Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'config', '--add', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*')
  Invoke-Git -Arguments @("--git-dir=$mirrorPath", 'config', '--add', 'remote.origin.fetch', '+refs/tags/*:refs/tags/*')
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
    Bootstrap-CodexWorkspace -BranchPath $folderPath

    Write-Log "prepared $branch -> $folderPath"
  }

  Write-Manifest -Entries $entries
  Write-Log "session prepared: $sessionPath"
}

function Get-SessionItems {
  $jsonManifestPath = Get-ManifestPath
  $items = @()

  if (Test-Path -LiteralPath $jsonManifestPath) {
    $manifest = Get-Content -LiteralPath $jsonManifestPath -Raw | ConvertFrom-Json
    $items = @($manifest.items)
  } else {
    $tsvManifestPath = Join-Path (Get-SessionPath) '.session-manifest.tsv'
    if (-not (Test-Path -LiteralPath $tsvManifestPath)) {
      Fail "Session manifest missing: $jsonManifestPath or $tsvManifestPath (run prepare first)"
    }

    $lines = Get-Content -LiteralPath $tsvManifestPath
    foreach ($line in $lines | Select-Object -Skip 1) {
      if ([string]::IsNullOrWhiteSpace($line)) {
        continue
      }
      $parts = $line -split "`t", 3
      if ($parts.Count -lt 3) {
        continue
      }
      $items += [PSCustomObject]@{
        branch = $parts[0]
        folder = $parts[1]
        path = $parts[2]
      }
    }
  }

  if ($MaxBranches -gt 0) {
    $items = @($items | Select-Object -First $MaxBranches)
  }

  return @($items)
}

function Open-CodeWindow {
  param([string]$Path)

  $codeCmd = Get-Command code -ErrorAction SilentlyContinue
  if (-not $codeCmd) {
    Fail "VS Code CLI 'code' not found in PATH"
  }

  $codexHome = Join-Path $Path '.codex'
  $startArgs = @{
    FilePath = $codeCmd.Source
    ArgumentList = @('-n', $Path)
    WorkingDirectory = $Path
  }

  # Use per-window CODEX_HOME so each workshop branch gets its own Codex context.
  $supportsEnv = (Get-Command Start-Process).Parameters.ContainsKey('Environment')
  if ($supportsEnv) {
    $startArgs['Environment'] = @{ CODEX_HOME = $codexHome }
    Start-Process @startArgs | Out-Null
    return
  }

  $previous = $env:CODEX_HOME
  $hadPrevious = Test-Path Env:CODEX_HOME
  try {
    $env:CODEX_HOME = $codexHome
    Start-Process @startArgs | Out-Null
  } finally {
    if ($hadPrevious) {
      $env:CODEX_HOME = $previous
    } else {
      Remove-Item Env:CODEX_HOME -ErrorAction SilentlyContinue
    }
  }
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

function CommandLine-MatchesToken {
  param(
    [string]$CommandLine,
    [string[]]$Tokens
  )

  if ([string]::IsNullOrWhiteSpace($CommandLine)) {
    return $false
  }

  foreach ($token in $Tokens) {
    if ([string]::IsNullOrWhiteSpace($token)) {
      continue
    }
    if ($CommandLine.IndexOf($token, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
      return $true
    }
  }

  return $false
}

function Get-CodeProcessesForSessionItem {
  param([Parameter(Mandatory = $true)][object]$Item)

  $sessionFolder = Split-Path -Leaf (Split-Path -Parent $Item.path)
  $pathForward = ($Item.path -replace '\\', '/')
  $pathBack = ($Item.path -replace '/', '\')

  $tokens = @(
    $Item.path,
    $pathForward,
    $pathBack,
    "$sessionFolder/$($Item.folder)",
    "$sessionFolder\$($Item.folder)"
  )

  $all = Get-CimInstance Win32_Process -Filter "Name='Code.exe'" -ErrorAction SilentlyContinue
  return @($all | Where-Object { CommandLine-MatchesToken -CommandLine $_.CommandLine -Tokens $tokens })
}

function Move-CodeProcessToDesktop {
  param(
    [Parameter(Mandatory = $true)][int]$ProcessId,
    [Parameter(Mandatory = $true)][object]$Desktop
  )

  $moveWindowCmd = Get-Command Move-Window -ErrorAction SilentlyContinue
  if (-not $moveWindowCmd) {
    return $false
  }

  try {
    if ($moveWindowCmd.Parameters.ContainsKey('ProcessId') -and $moveWindowCmd.Parameters.ContainsKey('Desktop')) {
      Move-Window -ProcessId $ProcessId -Desktop $Desktop | Out-Null
      return $true
    }

    $proc = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if ($null -eq $proc -or $proc.MainWindowHandle -eq 0) {
      return $false
    }

    foreach ($handleParam in @('Hwnd', 'Handle', 'WindowHandle', 'MainWindowHandle')) {
      if ($moveWindowCmd.Parameters.ContainsKey($handleParam) -and $moveWindowCmd.Parameters.ContainsKey('Desktop')) {
        $args = @{ Desktop = $Desktop }
        $args[$handleParam] = $proc.MainWindowHandle
        Move-Window @args | Out-Null
        return $true
      }
    }

    # Some VirtualDesktop modules use positional args: Move-Window <hwnd> <desktop>
    Move-Window $proc.MainWindowHandle $Desktop | Out-Null
    return $true
  } catch {
    Write-Warning "Unable to move Code process $ProcessId to desktop: $($_.Exception.Message)"
    return $false
  }
}

function Arrange-SessionDesktops {
  if (-not $IsWindows) {
    Fail "Mode 'desktops' must be run from Windows PowerShell (outside WSL)."
  }

  if (-not (Test-VirtualDesktopSupport)) {
    Fail "Virtual desktop commands not found. Install/import a compatible module (for example VirtualDesktop)."
  }

  if (-not (Get-Command Move-Window -ErrorAction SilentlyContinue)) {
    Fail "Move-Window command not found. Install/import a module that supports moving windows between desktops."
  }

  $items = Get-SessionItems
  $desktopIndex = 0
  foreach ($item in $items) {
    $desktop = New-Desktop
    $moved = 0
    $processes = Get-CodeProcessesForSessionItem -Item $item
    foreach ($proc in $processes) {
      if (Move-CodeProcessToDesktop -ProcessId $proc.ProcessId -Desktop $desktop) {
        $moved++
      }
    }

    if ($moved -eq 0) {
      Write-Warning "No VS Code windows matched session item: $($item.branch) ($($item.path))"
    } else {
      Write-Log "moved $moved VS Code window(s) for $($item.branch) to desktop index $desktopIndex"
    }

    $desktopIndex++
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
  'desktops' { Arrange-SessionDesktops }
  'all' {
    Prepare-Session
    Launch-Session
  }
  'teardown' { Teardown-Session }
}
