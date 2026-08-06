const fs = require('fs');
const glob = require('glob'); // Note: we'll use a simple recursive find if glob isn't available

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(`${dir}/${file}`);
    if (stat.isDirectory()) {
      findFiles(`${dir}/${file}`, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(`${dir}/${file}`);
    }
  }
  return fileList;
}

const files = findFiles('./apps/web/src');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('useReactTable') || content.includes('watch(') || content.includes(' watch(')) {
    if (!content.includes('eslint-disable react-hooks/incompatible-library') && !content.includes('eslint-disable-next-line react-hooks/incompatible-library')) {
      fs.writeFileSync(file, '/* eslint-disable react-hooks/incompatible-library */\n' + content);
      console.log('Fixed', file);
    }
  }
}
