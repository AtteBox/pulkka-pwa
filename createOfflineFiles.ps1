# Description: Creates a file with a list of all files in the www folder (the offline files of the PWA)

$OfflineFilePath = "./www/offlineFiles.js"

"const OFFLINE_FILES = " + (
    Get-ChildItem ./www -Recurse -File 
    | Resolve-Path -Relative 
    | ForEach-Object { $_.replace('./www', '') } 
    | ConvertTo-Json) + ";" > $OfflineFilePath 

Write-Host "Created $OfflineFilePath with content:"
Write-Host "----------------------------------------"
Get-Content $OfflineFilePath
Write-Host "----------------------------------------"