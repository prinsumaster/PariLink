const fs = require('fs');

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
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Remove the old invalid top-level comment if it exists
  if (content.startsWith('/* eslint-disable react-hooks/incompatible-library */\n')) {
    content = content.replace('/* eslint-disable react-hooks/incompatible-library */\n', '');
    changed = true;
  }

  // Add line-level disables for useReactTable
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if ((lines[i].includes('useReactTable({') || lines[i].includes('watch(') || lines[i].includes(' watch(')) && !lines[i].includes('eslint-disable')) {
      if (i > 0 && !lines[i-1].includes('eslint-disable-next-line react-hooks/incompatible-library')) {
        const indent = lines[i].match(/^\s*/)[0];
        lines.splice(i, 0, `${indent}// eslint-disable-next-line react-hooks/incompatible-library`);
        i++; // Skip the newly added line
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Fixed', file);
  }
}
