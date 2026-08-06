import { Project, SyntaxKind, CallExpression, Node } from 'ts-morph';
import * as path from 'path';

const project = new Project();
project.addSourceFilesAtPaths('apps/api/src/**/*.ts');

// Exclude test files and migrations
const sourceFiles = project.getSourceFiles().filter((sf) => {
  const p = sf.getFilePath();
  return !p.includes('.spec.ts') && !p.includes('prisma/migrations');
});

let modifiedCount = 0;

for (const sourceFile of sourceFiles) {
  let fileModified = false;
  const isSystemModule =
    sourceFile.getFilePath().includes('/admin/') ||
    sourceFile.getFilePath().includes('/auth/') ||
    sourceFile.getFilePath().includes('/webhooks/') ||
    sourceFile.getFilePath().includes('/background/');

  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

  // Process in reverse to avoid node invalidation
  for (let i = callExpressions.length - 1; i >= 0; i--) {
    const callExpr = callExpressions[i];
    
    const expression = callExpr.getExpression();
    
    // Check if the call is a Prisma call like `this.prisma.user.findUnique(...)`
    const exprText = expression.getText();
    if (!exprText.startsWith('this.prisma.') || exprText.includes('runAsTenant') || exprText.includes('runAsSystem') || exprText.includes('$transaction') || exprText.includes('$executeRaw')) {
      continue;
    }

    const parts = exprText.split('.');
    if (parts.length < 3) continue;

    const modelName = parts[2];
    const methodName = parts[3];

    // Identify Prisma methods that hit the DB
    const dbMethods = ['findUnique', 'findFirst', 'findMany', 'create', 'update', 'updateMany', 'delete', 'deleteMany', 'count', 'aggregate', 'groupBy'];
    if (!dbMethods.includes(methodName)) continue;

    // Determine if companyId is in scope
    let companyIdInScope = false;
    let current: Node | undefined = callExpr;
    while (current) {
      if (Node.isFunctionDeclaration(current) || Node.isMethodDeclaration(current) || Node.isArrowFunction(current)) {
        const params = current.getParameters();
        for (const param of params) {
          if (param.getName() === 'companyId') {
            companyIdInScope = true;
            break;
          }
        }
        if (companyIdInScope) break;
      }
      current = current.getParent();
    }

    const originalArgs = callExpr.getArguments().map(a => a.getText()).join(', ');
    let replacement = '';

    if (isSystemModule || !companyIdInScope) {
      // System query
      replacement = `await this.prisma.runAsSystem(async (tx) => tx.${modelName}.${methodName}(${originalArgs}))`;
    } else {
      // Tenant query
      replacement = `await this.prisma.runAsTenant(companyId, async (tx) => tx.${modelName}.${methodName}(${originalArgs}))`;
    }

    const parent = callExpr.getParent();
    if (Node.isAwaitExpression(parent)) {
      parent.replaceWithText(replacement);
    } else {
      const noAwaitReplacement = replacement.replace(/^await /, '');
      callExpr.replaceWithText(noAwaitReplacement);
    }

    fileModified = true;
  }

  if (fileModified) {
    sourceFile.saveSync();
    modifiedCount++;
    console.log(`Refactored: ${sourceFile.getFilePath()}`);
  }
}

console.log(`Completed refactoring ${modifiedCount} files.`);
