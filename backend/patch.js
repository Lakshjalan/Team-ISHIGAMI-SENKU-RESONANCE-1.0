import fs from 'fs';
let content = fs.readFileSync('src/services/blockingService.js', 'utf8');
content = content.replace(
  "console.error('Failed to parse ML output:', result.stdout);",
  "console.error('Failed to parse ML output. stdout:', result.stdout, 'stderr:', result.stderr);"
);
content = content.replace(
  "if (predictions && predictions.length === pairsToScore.length) {",
  "console.log('Predictions length:', predictions ? predictions.length : 0, 'Pairs length:', pairsToScore.length);\n      if (predictions && predictions.length === pairsToScore.length) {"
);
fs.writeFileSync('src/services/blockingService.js', content);
