const fs = require('fs');
const content = fs.readFileSync('predictions.js', 'utf8');
const jsonStr = content.split('const PREDICTIONS = ')[1].trim().replace(/;$/, '');
const predictions = JSON.parse(jsonStr);
fs.writeFileSync('predictions_manifest.json', JSON.stringify({ predictions }, null, 2));
console.log('Manifest generated.');
