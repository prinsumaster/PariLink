const fs = require('fs');
const data = JSON.parse(fs.readFileSync('routes-audit-raw.json', 'utf8'));

// Generate ROUTE_CONTRACT_AUDIT.md
let auditMd = `# PARILINK 2.0 — ROUTE CONTRACT AUDIT

| Frontend API Request | Expected API Endpoint | Actual NestJS Route | Controller | Authentication | Status | Notes |
|---------------------|----------------------|--------------------|------------|----------------|--------|-------|\n`;

let mismatchesMd = `# PARILINK 2.0 — API FRONTEND MISMATCHES

## 1. Frontend endpoints that do not exist in Backend
`;

let validRoutes = 0;
let mismatchCount = 0;

for (const req of data.apiRequests) {
    // try to match it against nestRoutes
    // requests might not have /api/v1 prefix in the code if they use an axios instance that appends it.
    let expected = req;
    if (!expected.startsWith('/api/v1')) {
        if (expected.startsWith('/api/')) expected = expected.replace('/api/', '/api/v1/');
        else expected = '/api/v1' + (expected.startsWith('/') ? expected : '/' + expected);
    }
    
    // Exact match or parameterized match
    const isMatch = data.nestRoutes.find(n => {
        // Simple parameter abstraction
        const normalizedNest = n.route.replace(/:[^\/]+/g, '[PARAM]').split('?')[0];
        const normalizedReq = expected.replace(/\/[a-f0-9-]{36}/g, '/[PARAM]')
            .replace(/\/\d+/g, '/[PARAM]').split('?')[0];
        return normalizedNest === normalizedReq || expected.startsWith(n.route.replace(/:.*/, ''));
    });

    if (isMatch) {
        auditMd += `| \`${req}\` | \`${expected}\` | \`${isMatch.route}\` | \`${isMatch.controller}\` | ${isMatch.auth} | ✅ OK | Match |\n`;
        validRoutes++;
    } else {
        auditMd += `| \`${req}\` | \`${expected}\` | ❌ NOT FOUND | N/A | N/A | ❌ 404 | Orphaned or missing API |\n`;
        mismatchesMd += `- Frontend Request: \`${req}\` -> Expected: \`${expected}\` (No matching NestJS controller)\n`;
        mismatchCount++;
    }
}

mismatchesMd += `\n## 2. Unused Backend Endpoints (No explicit frontend consumer detected)
`;
for (const n of data.nestRoutes) {
    const isUsed = data.apiRequests.find(req => {
        let expected = req;
        if (!expected.startsWith('/api/v1')) {
            if (expected.startsWith('/api/')) expected = expected.replace('/api/', '/api/v1/');
            else expected = '/api/v1' + (expected.startsWith('/') ? expected : '/' + expected);
        }
        return expected.startsWith(n.route.replace(/:.*/, ''));
    });
    if (!isUsed) {
        mismatchesMd += `- API Endpoint: \`${n.method} ${n.route}\` (${n.controller})\n`;
    }
}

fs.writeFileSync('ROUTE_CONTRACT_AUDIT.md', auditMd);
fs.writeFileSync('API_FRONTEND_MISMATCHES.md', mismatchesMd);

console.log(`Generated reports. Valid matches: ${validRoutes}, Mismatches: ${mismatchCount}`);
