const fs = require('fs');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(`${dir}/${file}`);
    if (stat.isDirectory()) {
      findFiles(`${dir}/${file}`, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(`${dir}/${file}`);
    }
  }
  return fileList;
}

const files = findFiles('./apps/web/src');
let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('await fetch(process.env.NEXT_PUBLIC_API_URL')) {
    // We replace simple GET requests
    // Example: const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/finance/payroll', { ... });
    // And their .json() resolution
    
    // Using a regex to replace these simple fetch blocks
    const regex = /const res = await fetch\(process\.env\.NEXT_PUBLIC_API_URL \+ '([^']+)',\s*\{\s*headers:\s*\{\s*'Authorization': `Bearer \$\{token\}`,\s*'X-Tenant-ID': tenantId\s*\}\s*\}\s*\);/g;
    
    if (content.match(regex)) {
      content = content.replace(regex, "const res = await api.get('$1');");
      // Now replace the `res.json()` part since axios gives us `res.data`
      // Usually it looks like: const data = await res.json();
      content = content.replace(/const data = await res\.json\(\);/g, "const data = res.data;");
      
      // Also ensure api is imported
      if (!content.includes("import { api } from '@/services/api';")) {
        content = "import { api } from '@/services/api';\n" + content;
      }
      
      fs.writeFileSync(file, content);
      console.log('Fixed fetch in', file);
      count++;
    } else {
       // if they didn't even have headers, they were completely broken
       const brokenRegex = /const res = await fetch\(process\.env\.NEXT_PUBLIC_API_URL \+ '([^']+)'(?:,\s*\{[^}]*\}\s*)?\);/g;
       if (content.match(brokenRegex)) {
          content = content.replace(brokenRegex, "const res = await api.get('$1');");
          content = content.replace(/const data = await res\.json\(\);/g, "const data = res.data;");
          if (!content.includes("import { api } from '@/services/api';")) {
            content = "import { api } from '@/services/api';\n" + content;
          }
          fs.writeFileSync(file, content);
          console.log('Fixed broken fetch in', file);
          count++;
       }
    }
  }
}
console.log('Total fixed:', count);
