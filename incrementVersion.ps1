# Description: Increments the version number in the version.js file
Param([string]$IncrementType = "patch")

if ($IncrementType -notin @("major", "minor", "patch")) {
    throw "Invalid increment type. Valid values are: major, minor, patch"
}

$VersionFilePath = "./www/version.js"

if (-not ((Get-Content $VersionFilePath) -match '"\d+.\d+.\d+"')) { 
    throw "Version number not found in version.js file"
}
$PrevVersion = $matches[0].replace('"', '')

$VersionParts = $PrevVersion.split('.')

$Major = [int]$VersionParts[0]
$Minor = [int]$VersionParts[1]
$Patch = [int]$VersionParts[2]

if ($IncrementType -eq "major") {
    $Major++
    $Minor = 0
    $Patch = 0
}
elseif ($IncrementType -eq "minor") {
    $Minor++
    $Patch = 0
}
elseif ($IncrementType -eq "patch") {
    $Patch++
}

$Version = "$Major.$Minor.$Patch"
Write-Host "v. $PrevVersion -> v. $Version"


(Get-Content $VersionFilePath) -replace $PrevVersion, $Version | Set-Content $VersionFilePath


Write-Host "Created $VersionFilePath with content:"
Write-Host "----------------------------------------"
Get-Content $VersionFilePath
Write-Host "----------------------------------------"