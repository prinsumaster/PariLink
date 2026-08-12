const fs = require('fs');
const path = require('path');

// --- Helpers ---
function walkSync(dir, filelist = [], ext = '.ts') {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory()
        ? walkSync(dirFile, filelist, ext)
        : (dirFile.endsWith(ext) || dirFile.endsWith('.tsx') ? filelist.concat(dirFile) : filelist);
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'EACCES') { } else throw err;
    }
  });
  return filelist;
}

// --- 1. Next.js Routes ---
const webAppDir = path.join(__dirname, 'apps/web/src/app');
const nextRoutes = [];
const webFiles = walkSync(webAppDir, [], '.tsx');
for (const file of webFiles) {
  if (file.endsWith('page.tsx')) {
    let route = file.replace(webAppDir, '').replace(/\/page\.tsx$/, '');
    if (route === '') route = '/';
    // Remove route groups like (dashboard)
    route = route.split('/').filter(p => !p.startsWith('(') && !p.endsWith(')')).join('/');
    if (route === '') route = '/';
    if (!nextRoutes.includes(route)) {
        nextRoutes.push(route);
    }
  }
}

// --- 2. Frontend API Requests ---
const allWebFiles = walkSync(path.join(__dirname, 'apps/web/src'), [], '.ts');
const fetchPattern = /(?:fetch|axios|api\.(?:get|post|put|patch|delete))\s*\(\s*['"`]([^'"`\$]+)['"`]/g;
const reactQueryPattern = /use(?:Query|Mutation)\s*\(\s*\{.*queryKey:\s*\[([^\]]+)\].*\}/gs;

const apiRequests = new Set();
for (const file of allWebFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = fetchPattern.exec(content)) !== null) {
    if (match[1].startsWith('/api/') || match[1].startsWith('/')) {
        apiRequests.add(match[1]);
    }
  }
}

// --- 3. NestJS Controllers ---
const apiDir = path.join(__dirname, 'apps/api/src');
const apiFiles = walkSync(apiDir, [], '.controller.ts');
const nestRoutes = [];

const controllerPattern = /@Controller\(['"`](.*?)['"`]\)/;
const methodPattern = /@(Get|Post|Put|Patch|Delete)\(['"`]?(.*?)['"`]?\)/g;

for (const file of apiFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const controllerMatch = content.match(controllerPattern);
    if (!controllerMatch) continue;
    
    let baseRoute = controllerMatch[1] || '';
    if (baseRoute && !baseRoute.startsWith('/')) baseRoute = '/' + baseRoute;
    if (baseRoute === '/') baseRoute = '';

    let match;
    while ((match = methodPattern.exec(content)) !== null) {
        const method = match[1].toUpperCase();
        let subRoute = match[2] || '';
        if (subRoute && !subRoute.startsWith('/')) subRoute = '/' + subRoute;
        
        const fullRoute = `/api/v1${baseRoute}${subRoute}`.replace(/\/+/g, '/');
        nestRoutes.push({
            controller: path.basename(file),
            method,
            route: fullRoute,
            auth: content.includes('JwtAuthGuard') || content.includes('@Public') ? (content.includes('@Public') ? 'Public' : 'JWT') : 'Unknown'
        });
    }
}

const output = {
    nextRoutes: nextRoutes.sort(),
    apiRequests: Array.from(apiRequests).sort(),
    nestRoutes: nestRoutes.sort((a,b) => a.route.localeCompare(b.route))
};

fs.writeFileSync('routes-audit-raw.json', JSON.stringify(output, null, 2));
console.log('Audit complete.');
