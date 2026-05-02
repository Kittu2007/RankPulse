const fs = require('fs');
const zlib = require('zlib');

// Docx is a ZIP file. Let's just find word/document.xml in it.
// Actually, an easier way: just use child_process powershell Expand-Archive if we were in powershell, 
// Or better yet, we can use the 'unzipper' or 'adm-zip' module if installed. 
// Since we don't know what's installed, let's just use powershell to read the docx.
