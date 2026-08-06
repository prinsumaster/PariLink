const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const repoPath = '/Users/vishalvirda/Desktop/PariLink';
const reportPath = path.join(repoPath, 'apps/api/eslint-report.json');

const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const project = new Project({
  tsConfigFilePath: path.join(repoPath, 'apps/api/tsconfig.json'),
});

let fixCount = 0;

for (const fileResult of reportData) {
  const violations = fileResult.messages.filter(
    (msg) =>
      msg.ruleId === 'no-restricted-syntax' &&
      msg.message.includes('Direct Prisma model access')
  );

  if (violations.length === 0) continue;

  const sourceFile = project.getSourceFile(fileResult.filePath);
  if (!sourceFile) {
    console.log(`Could not load ${fileResult.filePath}`);
    continue;
  }

  // Sort violations from bottom to top to avoid line number shifts
  violations.sort((a, b) => b.line - a.line);

  for (const msg of violations) {
    // Find the property access expression (e.g. this.prisma.model) at the given line and column
    const pos = sourceFile.compilerNode.getPositionOfLineAndCharacter(msg.line - 1, msg.column - 1);
    let node = sourceFile.getDescendantAtPos(pos);
    
    // Walk up to find the CallExpression (e.g. this.prisma.model.method(...))
    let callExpr = node?.getFirstAncestorByKind(SyntaxKind.CallExpression);
    if (!callExpr) continue;
    
    const expression = callExpr.getExpression();
    if (expression.getKind() !== SyntaxKind.PropertyAccessExpression) continue;
    
    // Check if it's await this.prisma...
    const awaitExpr = callExpr.getParentIfKind(SyntaxKind.AwaitExpression);
    const targetNode = awaitExpr || callExpr;
    
    const originalText = callExpr.getText();
    // Replace `this.prisma` with `tx`
    const newText = originalText.replace(/this\.prisma/g, 'tx');
    
    // Very naive scope check for companyId
    const fileText = sourceFile.getFullText();
    let wrapper = '';
    
    // Check if companyId is available in the current method scope
    let methodDecl = targetNode.getFirstAncestorByKind(SyntaxKind.MethodDeclaration) 
      || targetNode.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration)
      || targetNode.getFirstAncestorByKind(SyntaxKind.ArrowFunction);
      
    let hasCompanyId = false;
    if (methodDecl) {
       hasCompanyId = methodDecl.getText().includes('companyId');
    }

    if (hasCompanyId) {
       wrapper = `await this.prisma.runAsTenant(companyId, async (tx) => ${newText})`;
    } else {
       wrapper = `await this.prisma.runAsSystem(async (tx) => ${newText})`;
    }
    
    // If it was already awaited, we don't need another await if we just replace the whole awaitExpr
    if (awaitExpr) {
       awaitExpr.replaceWithText(wrapper);
    } else {
       callExpr.replaceWithText(wrapper);
    }
    fixCount++;
  }
  
  sourceFile.saveSync();
}

console.log(`Fixed ${fixCount} RLS violations.`);
