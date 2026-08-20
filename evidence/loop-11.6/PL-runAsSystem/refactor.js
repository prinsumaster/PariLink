const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project({
  tsConfigFilePath: '../../../apps/api/tsconfig.json',
});

const sourceFiles = project.getSourceFiles();
const inventory = [];
let totalConverted = 0;
let totalBypass = 0;

for (const sourceFile of sourceFiles) {
  let fileChanged = false;
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  
  for (const call of calls) {
    const expr = call.getExpression();
    if (expr.getText().endsWith('.runAsSystem')) {
      inventory.push(`${sourceFile.getFilePath()}:${call.getStartLineNumber()}`);
      const args = call.getArguments();
      if (args.length === 1) {
        const isController = sourceFile.getBaseName().endsWith('.controller.ts');
        const method = call.getFirstAncestorByKind(SyntaxKind.MethodDeclaration);
        
        let replacedWithTenant = false;
        if (isController && method) {
          const params = method.getParameters();
          for (const param of params) {
            const hasGetUser = param.getDecorators().some(d => d.getName() === 'GetUser');
            if (hasGetUser) {
              const paramName = param.getName();
              expr.replaceWithText(expr.getText().replace('.runAsSystem', '.runAsTenant'));
              call.insertArgument(0, `${paramName}.companyId`);
              replacedWithTenant = true;
              fileChanged = true;
              totalConverted++;
              inventory.push(`  -> Converted to runAsTenant(${paramName}.companyId)`);
              break;
            }
          }
        }
        
        if (!replacedWithTenant) {
          call.insertArgument(0, `'System operation or legacy bypass'`);
          fileChanged = true;
          totalBypass++;
        }
      }
    }
  }

  if (fileChanged) {
    sourceFile.saveSync();
  }
}

fs.writeFileSync('../../../docs/security/runAsSystem_inventory.txt', inventory.join('\n'));
console.log(`Inventory saved. Refactored ${totalConverted} to runAsTenant and ${totalBypass} to legacy bypass.`);
