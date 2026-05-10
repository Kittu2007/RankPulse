$docxPath = "c:\Users\admin.DESKTOP-7EBDCSF\Downloads\RankPulse_Master_Prompt_v3 (2).docx"
$zipPath = "$env:TEMP\docx_extract_$(Get-Random).zip"
Copy-Item $docxPath $zipPath
$tempPath = "$env:TEMP\docx_extract_$(Get-Random)"
Expand-Archive -Path $zipPath -DestinationPath $tempPath -Force
$xml = Get-Content "$tempPath\word\document.xml" -Raw
$text = $xml -replace '<[^>]+>', "`n"
$text = $text -replace '\n+', "`n"
$text | Out-File docx_output.txt -Encoding utf8
Remove-Item -Recurse -Force $tempPath
Remove-Item -Force $zipPath
