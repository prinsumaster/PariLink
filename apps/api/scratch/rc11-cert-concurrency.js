const fs = require('fs');

async function main() {
  const envData = fs.readFileSync('/Users/vishalvirda/.gemini/antigravity-ide/brain/9ea85605-4743-4623-bf3a-ce023bac5d60/rc10-final-evidence/RC10-P06-api-env.sh', 'utf8');
  const getVal = (key) => envData.match(new RegExp(`${key}="(.*)"`))?.[1];
  
  // need fresh tokens since old ones expired
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = 'e48257e0a9b0fdabd798936563fe6f105b8948d64ec6ee4b2a954a1fc4797b47a6b45f350e7f09fd50a94068641589a93eba9605c690149befa0d7cd9893cea0';
  const oldPayloadA = jwt.decode(getVal('TOKEN_A'));
  const oldPayloadB = jwt.decode(getVal('TOKEN_B'));
  const tokenA = jwt.sign({ sub: oldPayloadA.sub, cid: oldPayloadA.cid, rid: 'USER' }, JWT_SECRET, { algorithm: 'HS512' });
  const tokenB = jwt.sign({ sub: oldPayloadB.sub, cid: oldPayloadB.cid, rid: 'USER' }, JWT_SECRET, { algorithm: 'HS512' });
  
  const threadA = getVal('THREAD_A');
  const threadB = getVal('THREAD_B');

  let results = { A_success: 0, B_success: 0, A_denied: 0, B_denied: 0, errors: 0 };

  async function makeReq(token, thread, isLegit) {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/inbox/threads/${thread}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (isLegit && res.status === 200) {
        if (token === tokenA) results.A_success++;
        else results.B_success++;
      } else if (!isLegit && res.status === 404) {
        if (token === tokenA) results.A_denied++;
        else results.B_denied++;
      } else {
        results.errors++;
      }
    } catch(e) {
      results.errors++;
    }
  }

  console.log("Starting concurrency test (1000 requests)...");
  const promises = [];
  for (let i=0; i<250; i++) {
    promises.push(makeReq(tokenA, threadA, true));
    promises.push(makeReq(tokenB, threadB, true));
    promises.push(makeReq(tokenA, threadB, false));
    promises.push(makeReq(tokenB, threadA, false));
  }
  
  await Promise.all(promises);
  fs.writeFileSync('/Users/vishalvirda/.gemini/antigravity-ide/brain/9ea85605-4743-4623-bf3a-ce023bac5d60/rc11-certification-evidence/RC11-P15-concurrency-isolation.txt', JSON.stringify(results, null, 2));
  console.log(results);
}
main();
