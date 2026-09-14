import fs from 'fs';
let content = fs.readFileSync('src/services/blockingService.js', 'utf8');
content = content.replace(
  "if (pairsToScore.length > 0) {",
  "console.log('pairsToScore.length =', pairsToScore.length);\n  if (pairsToScore.length > 0) {"
);
fs.writeFileSync('src/services/blockingService.js', content);
