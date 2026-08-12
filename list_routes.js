const fs = require('fs');
const path = require('path');

function findRoutes(dir, baseRoute = '') {
  let routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  let hasPage = false;
  for (const entry of entries) {
    if (entry.name === 'page.tsx' || entry.name === 'page.js') {
      hasPage = true;
    }
  }
  
  if (hasPage && baseRoute !== '') {
    routes.push(baseRoute.replace(/\/\([^)]+\)/g, '').replace(/\/$/, '') || '/');
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const newBase = baseRoute + '/' + entry.name;
      routes.push(...findRoutes(path.join(dir, entry.name), newBase));
    }
  }

  return [...new Set(routes)].sort();
}

const routes = findRoutes('./apps/web/src/app');
console.log(`Total Routes Discovered: ${routes.length}`);
console.log(routes.join('\n'));
