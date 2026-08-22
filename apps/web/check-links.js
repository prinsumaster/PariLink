const { navigationConfig } = require('./src/config/navigation');
const fs = require('fs');

async function checkLinks() {
  const links = [];
  navigationConfig.forEach(group => {
    group.items.forEach(item => {
      links.push(item.href);
      if (item.children) {
        item.children.forEach(child => links.push(child.href));
      }
    });
  });
  
  console.log(`Checking ${links.length} links...`);
  
  for (const link of links) {
    const url = `http://localhost:3000${link}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`[404] ${link}`);
      }
    } catch (e) {
      console.log(`[ERR] ${link}`);
    }
  }
}
checkLinks();
