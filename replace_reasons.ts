import { Project, SyntaxKind, StringLiteral, CallExpression } from 'ts-morph';

const project = new Project();
project.addSourceFilesAtPaths('apps/api/src/**/*.ts');

const sourceFiles = project.getSourceFiles();
let updatedCount = 0;

for (const sourceFile of sourceFiles) {
  let fileChanged = false;

  // Find all string literals
  const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
  
  for (const literal of stringLiterals) {
    if (literal.getLiteralText() === 'System operation or legacy bypass') {
      // Check if it's the first argument to runAsSystem
      const parent = literal.getParent();
      if (parent && parent.getKind() === SyntaxKind.CallExpression) {
        const callExpr = parent as CallExpression;
        const expression = callExpr.getExpression();
        const exprText = expression.getText();
        
        if (exprText.endsWith('runAsSystem')) {
          // Find enclosing method and class
          const method = literal.getFirstAncestorByKind(SyntaxKind.MethodDeclaration) || 
                         literal.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration) ||
                         literal.getFirstAncestorByKind(SyntaxKind.ArrowFunction);
          
          let methodName = 'unknownMethod';
          if (method && (method.getKind() === SyntaxKind.MethodDeclaration || method.getKind() === SyntaxKind.FunctionDeclaration)) {
            methodName = (method as any).getName() || 'anonymous';
          }

          const cls = literal.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
          let className = 'UnknownClass';
          if (cls) {
            className = cls.getName() || 'AnonymousClass';
          }

          let context = 'Internal service operation bypass';
          if (className.includes('Agent')) context = 'Autonomous AI Agent bypass';
          else if (className.includes('Webhook') || methodName.toLowerCase().includes('webhook')) context = 'Webhook handler bypass';
          else if (className.includes('Controller')) context = 'Global controller bypass';
          else if (className.includes('Processor') || className.includes('Cron') || className.includes('Job')) context = 'Background job bypass';
          else if (className.includes('Strategy') || className.includes('Guard')) context = 'Security/Auth lifecycle bypass';

          const newReason = `[${className}.${methodName}] ${context}`;
          
          literal.replaceWithText(`'${newReason}'`);
          fileChanged = true;
          updatedCount++;
        }
      }
    }
  }

  if (fileChanged) {
    sourceFile.saveSync();
    console.log(`Updated ${sourceFile.getFilePath()}`);
  }
}

console.log(`\nTotal occurrences updated: ${updatedCount}`);
