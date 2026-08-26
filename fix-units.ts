import fs from 'fs';
import path from 'path';

function walk(dir: string, cb: (f: string) => void) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full, cb);
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) cb(full);
  }
}

walk('apps/web/src', (f: string) => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (content.includes("Intl.NumberFormat('en-US'")) {
    content = content.replace(/Intl\.NumberFormat\('en-US'/g, "Intl.NumberFormat('en-IN'");
    changed = true;
  }
  if (content.includes("currency: 'USD'")) {
    content = content.replace(/currency: 'USD'/g, "currency: 'INR'");
    changed = true;
  }
  if (content.includes('USD')) {
    content = content.replace(/USD/g, 'INR');
    changed = true;
  }
  if (content.includes('MPG')) {
    content = content.replace(/MPG/g, 'kmpl');
    changed = true;
  }
  if (content.match(/ mi\b/)) {
    content = content.replace(/ mi\b/g, ' km');
    changed = true;
  }
  if (content.match(/>mi</)) {
    content = content.replace(/>mi</g, '>km<');
    changed = true;
  }
  if (content.includes('$')) {
    const old = content;
    content = content.replace(/\$(\d)/g, '₹$1');
    content = content.replace(/\$\$\{/g, '₹${');
    content = content.replace(/> \$/g, '> ₹');
    content = content.replace(/>\$/g, '>₹');
    if (old !== content) changed = true;
  }
  
  if (changed) fs.writeFileSync(f, content);
});
