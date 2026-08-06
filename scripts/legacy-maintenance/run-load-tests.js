const autocannon = require('autocannon');
const fs = require('fs');

async function runTest(connections, duration, title) {
  console.log(`\n--- Running Load Test: ${title} ---`);
  console.log(`Connections: ${connections}, Duration: ${duration}s`);
  
  const result = await autocannon({
    url: 'http://localhost:3000/api/v1/health/liveness',
    connections,
    duration,
    pipelining: 1,
  });

  console.log(`Latencies: Avg ${result.latency.average}ms | p99 ${result.latency.p99}ms`);
  console.log(`Req/Sec: ${result.requests.average}`);
  console.log(`Errors: ${result.errors}`);
  console.log(`Timeouts: ${result.timeouts}`);
  
  return {
    scenario: title,
    connections,
    avgLatency: result.latency.average,
    p99Latency: result.latency.p99,
    rps: result.requests.average,
    errors: result.errors,
    timeouts: result.timeouts
  };
}

async function main() {
  const results = [];
  try {
    results.push(await runTest(50, 5, "50 Concurrent Users"));
    results.push(await runTest(100, 5, "100 Concurrent Users"));
    results.push(await runTest(250, 5, "250 Concurrent Users"));
    results.push(await runTest(500, 5, "500 Concurrent Users (Spike)"));
    
    fs.writeFileSync('./rc5-load-results.json', JSON.stringify(results, null, 2));
    console.log('\n✅ Load tests complete. Results saved to rc5-load-results.json');
  } catch (err) {
    console.error('Test failed', err);
  }
}

main();
