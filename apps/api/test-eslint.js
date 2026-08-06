const { ESLint } = require("eslint");

(async function main() {
  const eslint = new ESLint({
    overrideConfig: {
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'MemberExpression[object.property.name="prisma"][property.name!="$on"][property.name!="runAsTenant"][property.name!="runAsSystem"][property.name!="$disconnect"][property.name!="updateWithOcc"][property.name!="setupSoftDeleteMiddleware"]',
            message: 'Direct Prisma access forbidden'
          }
        ]
      }
    }
  });

  const results = await eslint.lintFiles(["./src/**/*.ts"]);
  let count = 0;
  results.forEach(result => {
    result.messages.forEach(msg => {
      if (msg.message === 'Direct Prisma access forbidden') {
         console.log(result.filePath + ':' + msg.line);
         count++;
      }
    });
  });
  console.log('Total violations:', count);
})();
