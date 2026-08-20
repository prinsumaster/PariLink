const crypto = require('crypto');
const secret = 'my_super_secret_key_123';
const bodyObj = { type: "test", data: {} };
const rawBodyString = JSON.stringify(bodyObj);
const validSignature = crypto.createHmac('sha256', secret).update(rawBodyString).digest('hex');

const signatureBuffer = Buffer.from(validSignature, 'utf8');
const expectedBuffer = Buffer.from(validSignature, 'utf8');

console.log("Match?", crypto.timingSafeEqual(signatureBuffer, expectedBuffer));
