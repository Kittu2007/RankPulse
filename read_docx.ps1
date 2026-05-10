$docxPath = "c:\Users\admin.DESKTOP-7EBDCSF\Downloads\RankPulse_Master_Prompt_v3 (2).docx"
$tempPath = "$env:TEMP\docx_extract_$(Get-Random)"
Expand-Archive -Path $docxPath -DestinationPath $tempPath -Force
[xml]$docXml = Get-Content "$tempPath\word\document.xml"
$ns = New-Object System.Xml.XmlNamespaceManager($docXml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$paragraphs = $docXml.SelectNodes("//w:p", $ns)
foreach ($p in $paragraphs) {
    $textNodes = $p.SelectNodes(".//w:t", $ns)
    $pText = ""
    foreach ($t in $textNodes) { $pText += $t.InnerText }
    if ($pText) { Write-Output $pText }
}
Remove-Item -Recurse -Force $tempPath
