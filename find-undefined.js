const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  
  await page.goto('http://localhost:3000/operations', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // wait for render
  
  // Find exactly which DOM node contains the text "undefined"
  const nodesWithUndefined = await page.evaluate(() => {
    const iter = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const results = [];
    while (node = iter.nextNode()) {
      if (node.nodeValue.includes('undefined')) {
        results.push({
          text: node.nodeValue.trim(),
          parentHtml: node.parentElement ? node.parentElement.outerHTML : null
        });
      }
    }
    return results;
  });
  
  console.log(JSON.stringify(nodesWithUndefined, null, 2));
  await browser.close();
})();
