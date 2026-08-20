const crypto = require('crypto');
const companyId = '69430103-e17a-4b4a-a682-0a2c1c8f2f56';
const provider = 'ENTERPRISE_PAYMENTS';
const secret = 'my_super_secret_key_123';

(async () => {
  const bodyObj = { type: "test", data: {} };
  const rawBody = JSON.stringify(bodyObj);
  
  // 1. Valid Signature -> Expect 2xx
  const validSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  console.log("Testing VALID signature:", validSignature);
  const resValid = await fetch(`http://localhost:8080/api/v1/integration/gateway/${provider}/webhook/${companyId}`, {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "x-webhook-signature": validSignature
      },
      body: rawBody
  });
  console.log("Valid Signature Status:", resValid.status);
  console.log("Valid Signature Body:", await resValid.text());
})();
