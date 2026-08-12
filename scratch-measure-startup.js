const http = require('http');

async function checkPort(port, name) {
  const startTime = Date.now();
  let connected = false;
  
  while (!connected && (Date.now() - startTime) < 30000) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/api/health`, (res) => {
          if (res.statusCode === 200 || res.statusCode === 404) {
            resolve();
          } else {
            reject(new Error(`Status ${res.statusCode}`));
          }
        });
        req.on('error', reject);
      });
      connected = true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  const elapsed = Date.now() - startTime;
  if (connected) {
    console.log(`${name} started in ${elapsed}ms on port ${port}`);
  } else {
    console.error(`${name} FAILED to start within 30s on port ${port}`);
  }
}

async function run() {
  console.log("Measuring startup times...");
  await Promise.all([
    checkPort(8080, "API (nest)"),
    checkPort(3001, "WEB (next)")
  ]);
}

run();
