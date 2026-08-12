const fs = require('fs');
const data = JSON.parse(fs.readFileSync('routes-audit-raw.json', 'utf8'));

let md = `# PARILINK 2.0 — RUNTIME ROUTE TABLE & SHADOWING AUDIT\n\n`;

md += `## Potential Route Shadowing Warnings\n\n`;
let warnings = 0;
const routesByBase = {};

for (const n of data.nestRoutes) {
    const parts = n.route.split('/');
    if (parts.length < 4) continue;
    const base = parts.slice(0, 4).join('/'); // e.g. /api/v1/vehicles
    if (!routesByBase[base]) routesByBase[base] = [];
    routesByBase[base].push(n);
}

for (const [base, routes] of Object.entries(routesByBase)) {
    let wildcardFound = false;
    for (const r of routes) {
        if (r.route.includes('/:')) {
            wildcardFound = true;
        } else if (wildcardFound && r.route.length > base.length) {
            // A static route is appearing AFTER a wildcard in our sorted list!
            // Wait, this depends on NestJS order, not alphabetical.
            // My script sorted them alphabetically. To get true order, I'd need AST.
            // But we can flag ANY base path that mixes wildcards and static subpaths as risky!
        }
    }
}

// Flag controllers that have both /:id and /specific
const groupedByController = {};
for (const n of data.nestRoutes) {
    if (!groupedByController[n.controller]) groupedByController[n.controller] = [];
    groupedByController[n.controller].push(n);
}

for (const [ctrl, routes] of Object.entries(groupedByController)) {
    let hasWildcard = false;
    let hasStaticAfterWildcard = false;
    // We didn't keep source order, but we can look for the pattern.
    for (const r of routes) {
        if (r.route.endsWith('/:id') || r.route.endsWith('/:slug')) {
            hasWildcard = true;
        }
    }
    if (hasWildcard) {
        const statics = routes.filter(r => !r.route.includes('/:'));
        if (statics.length > 0) {
            md += `- ⚠️ **${ctrl}**: Contains both wildcard (\`:id\`) and static routes. Ensure static routes (like \`${statics.map(s => s.route).join(', ')}\`) are declared *before* wildcard routes in the controller class.\n`;
            warnings++;
        }
    }
}

if (warnings === 0) {
    md += `- ✅ No controller-level shadowing detected (static vs wildcard mixing).\n`;
}

md += `\n## Full NestJS Runtime Route Table\n\n`;
md += `| Method | Route Path | Controller | Auth |\n`;
md += `|--------|------------|------------|------|\n`;

for (const r of data.nestRoutes) {
    md += `| \`${r.method}\` | \`${r.route}\` | \`${r.controller}\` | ${r.auth} |\n`;
}

fs.writeFileSync('RUNTIME_ROUTE_TABLE.md', md);
console.log('Generated RUNTIME_ROUTE_TABLE.md');
