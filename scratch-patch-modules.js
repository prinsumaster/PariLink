const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('apps/api/src/**/*.module.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Find all processors
  const processorImports = [...content.matchAll(/import\s+{\s*([^}]+Processor)\s*}\s+from/g)];
  const executorImports = [...content.matchAll(/import\s+{\s*(WorkflowExecutorService)\s*}\s+from/g)];
  const allProcessors = [...processorImports, ...executorImports].map(m => m[1].trim());
  
  if (allProcessors.length > 0) {
    console.log(`Processing ${file} - found ${allProcessors.join(', ')}`);
    for (const p of allProcessors) {
      // Find `p` in providers array and replace with `...(process.env.RUN_WORKERS === 'true' ? [p] : [])`
      // We look for exactly `p` inside the providers array.
      // Easiest is to replace `p,` with `...(process.env.RUN_WORKERS === 'true' ? [p] : []),`
      // and `p]` with `...(process.env.RUN_WORKERS === 'true' ? [p] : [])]` (though that's rare due to trailing commas).
      
      const pRegexComma = new RegExp(`(?<=[\\s\\[,])${p}\\s*,`, 'g');
      const pRegexBracket = new RegExp(`(?<=[\\s\\[,])${p}\\s*\\]`, 'g');
      
      if (pRegexComma.test(content) || pRegexBracket.test(content)) {
        content = content.replace(pRegexComma, `...(process.env.RUN_WORKERS === 'true' ? [${p}] : []),`);
        content = content.replace(pRegexBracket, `...(process.env.RUN_WORKERS === 'true' ? [${p}] : [])]`);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
}
