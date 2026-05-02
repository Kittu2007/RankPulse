const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const content = fs.readFileSync(inputFile, 'utf-8');
let json;
try {
  json = JSON.parse(content);
} catch (e) {
  // Try to find the JSON part if there is any leading/trailing text
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  json = JSON.parse(content.substring(start, end + 1));
}

if (json && json.types) {
  const targetDir = path.dirname(outputFile);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(outputFile, json.types);
  console.log('Successfully wrote TypeScript types to ' + outputFile);
} else {
  console.error('Failed to find types in JSON');
  process.exit(1);
}
