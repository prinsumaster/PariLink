const crypto = require('crypto');
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
console.log("PRIV:", Buffer.from(privateKey).toString('base64'));
console.log("PUB:", Buffer.from(publicKey).toString('base64'));
