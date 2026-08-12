const fs = require('fs');
const path = require('path');

function findControllers(dir) {
  let controllers = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      controllers.push(...findControllers(path.join(dir, entry.name)));
    } else if (entry.name.endsWith('.controller.ts')) {
      controllers.push(path.join(dir, entry.name));
    }
  }

  return controllers;
}

const controllers = findControllers('./apps/api/src');
const endpoints = [];

for (const file of controllers) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  let currentController = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const controllerMatch = line.match(/@Controller\(['"]?([^)'"]+)['"]?\)/);
    if (controllerMatch) {
      currentController = controllerMatch[1];
      if (!currentController.startsWith('/')) currentController = '/' + currentController;
    }
    
    const methodMatch = line.match(/@(Get|Post|Put|Patch|Delete)\(['"]?([^)'"]*)['"]?\)/);
    if (methodMatch) {
      let route = methodMatch[2];
      if (route && !route.startsWith('/')) route = '/' + route;
      const fullRoute = `/api/v1${currentController}${route}`;
      endpoints.push(`${methodMatch[1].toUpperCase()} ${fullRoute}`);
    }
  }
}

console.log(`Total Endpoints Discovered: ${endpoints.length}`);
console.log(endpoints.sort().join('\n'));
