const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files we modified
const files = execSync('find src/portals -name "*.controller.ts"').toString().trim().split('\n');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find if a DTO is between decorators and @Controller
  const regex = /(@ApiTags[\s\S]*?@UseGuards[\s\S]*?)(export class [a-zA-Z0-9_]+Dto {[\s\S]*?})[\s\n]*(@Controller)/g;
  
  if (regex.test(content)) {
    console.log('Fixing', file);
    // Move the DTO class above the decorators
    content = content.replace(regex, '$2\n\n$1\n$3');
    fs.writeFileSync(file, content, 'utf8');
  } else {
    // maybe just @UseGuards
    const regex2 = /(@UseGuards[\s\S]*?)(export class [a-zA-Z0-9_]+Dto {[\s\S]*?})[\s\n]*(@Controller)/g;
    if (regex2.test(content)) {
      console.log('Fixing (regex2)', file);
      content = content.replace(regex2, '$2\n\n$1\n$3');
      fs.writeFileSync(file, content, 'utf8');
    }
  }
}
