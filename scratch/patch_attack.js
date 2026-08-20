const axios = require('axios');
const fs = require('fs');
const code = fs.readFileSync('evidence/loop-11.6/PL-A6-01/attack2.js', 'utf8');
const newCode = code.replace(
  /console\.error\(\`Run \$\{i\} Trip \$\{tripIndex\} FAIL: \$\{err.response\.status\}\`\);/, 
  'console.error(`Run ${i} Trip ${tripIndex} FAIL: ${err.response.status} - ${JSON.stringify(err.response.data)}`);'
);
fs.writeFileSync('evidence/loop-11.6/PL-A6-01/attack2_debug.js', newCode);
