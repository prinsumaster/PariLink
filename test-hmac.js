const crypto = require('crypto');

async function run() {
  const payload = {
    appId: "APP-TELEMETRY-1",
    companyId: "18f24eb8-0d1a-4ed1-8c96-3e3980e4ca5c",
    records: []
  };
  const bodyString = JSON.stringify(payload);
  
  // Test 1: No signature
  console.log("=== Test 1: No signature ===");
  const res1 = await fetch("http://localhost:8080/api/v1/ingress/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Origin": "http://localhost:3000" },
    body: bodyString
  });
  console.log("Status:", res1.status);
  
  // Test 2: Invalid signature
  console.log("\n=== Test 2: Invalid signature ===");
  const res2 = await fetch("http://localhost:8080/api/v1/ingress/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-signature": "sha256=abcdef", "Origin": "http://localhost:3000" },
    body: bodyString
  });
  console.log("Status:", res2.status);
}
run();
