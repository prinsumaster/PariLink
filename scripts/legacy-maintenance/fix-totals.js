const fs = require('fs');
const glob = require('glob');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = dir + '/' + file;
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filePath.endsWith(filter)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const pages = findFiles('./apps/web/src/app', 'page.tsx');
pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('data.total')) {
    content = content.replace(/\(data\.total \?\? 0\)/g, "(((data as any).meta?.total) ?? 0)");
    content = content.replace(/data\.total/g, "((data as any).meta?.total)");
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed pagination totals!');
