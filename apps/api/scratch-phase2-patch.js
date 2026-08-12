const fs = require('fs');
const glob = require('glob');
const path = require('path');

const tsFiles = glob.sync('/Users/vishalvirda/Desktop/PariLink/apps/api/src/**/*.service.ts');

function patchFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Patch "where: { id }" inside runAsTenant to "where: { id, companyId }"
    // This is a naive regex, we'll try to refine it or use it carefully.
    // It's safer to just do simple replacements where companyId is in scope.
    
    // We will look for tx.model.findUnique/findFirst/update/delete({ where: { id } })
    // and tx.model.updateMany({ where: { id, updatedAt... } })
    
    // For specific files, let's just make the replacements.
    const replacements = [
        { regex: /where:\s*{\s*id\s*}/g, replace: 'where: { id, companyId }' },
        { regex: /where:\s*{\s*id,\s*updatedAt:\s*([^ }]+)\s*}/g, replace: 'where: { id, companyId, updatedAt: $1 }' },
        { regex: /where:\s*{\s*id\s*:\s*([^,]+),\s*updatedAt:\s*([^ }]+)\s*}/g, replace: 'where: { id: $1, companyId, updatedAt: $2 }' },
    ];
    
    // BUT we only want to do this for files that actually take `companyId: string` as a parameter in the surrounding scope.
    // Let's just do it manually for the main ones.
}

console.log("Found", tsFiles.length, "service files");
