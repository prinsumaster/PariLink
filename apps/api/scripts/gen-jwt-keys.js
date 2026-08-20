#!/usr/bin/env node
/**
 * gen-jwt-keys.js
 *
 * Generates an RSA-2048 keypair for RS256 JWT signing and writes the
 * base64-encoded PEM values into the nearest .env file (repo root).
 *
 * Usage:
 *   npm run keys:generate           — refuses if keys already exist
 *   npm run keys:generate -- --force — overwrites existing keys
 *
 * The values written are single-line base64-encoded PEM so they are
 * shell-safe and work as-is in GitHub Actions secrets and VPS env files.
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Resolve .env from repo root (two levels up from apps/api/scripts/)
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const envPath = path.join(repoRoot, '.env');
const force = process.argv.includes('--force');

if (!fs.existsSync(envPath)) {
  console.error(`ERROR: .env not found at ${envPath}`);
  console.error('Create it first: cp .env.example .env');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const hasPrivate = /^JWT_PRIVATE_KEY=/m.test(envContent);
const hasPublic  = /^JWT_PUBLIC_KEY=/m.test(envContent);

if ((hasPrivate || hasPublic) && !force) {
  console.log('Keys already exist in .env');
  console.log('  JWT_PRIVATE_KEY present:', hasPrivate);
  console.log('  JWT_PUBLIC_KEY  present:', hasPublic);
  console.log('Use --force to regenerate (WARNING: invalidates all live sessions).');
  process.exit(0);
}

if (force && (hasPrivate || hasPublic)) {
  console.warn('WARNING: --force specified. All live sessions will be invalidated on next deploy.');
}

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding:  { type: 'spki',  format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const privateB64 = Buffer.from(privateKey).toString('base64');
const publicB64  = Buffer.from(publicKey).toString('base64');

const fingerprint = crypto
  .createHash('sha256')
  .update(publicKey)
  .digest('hex')
  .substring(0, 8);

// Remove old key lines if present
let updated = envContent
  .replace(/^JWT_PRIVATE_KEY=.*\n?/m, '')
  .replace(/^JWT_PUBLIC_KEY=.*\n?/m, '');

// Trim trailing newlines then append
updated = updated.trimEnd() + '\n';
updated += `\n# RS256 JWT keypair — generated ${new Date().toISOString()} (fingerprint: ${fingerprint})\n`;
updated += `JWT_PRIVATE_KEY="${privateB64}"\n`;
updated += `JWT_PUBLIC_KEY="${publicB64}"\n`;

fs.writeFileSync(envPath, updated, 'utf8');

console.log(`Keys generated and written to ${envPath}`);
console.log(`  Public key fingerprint (sha256[:8]): ${fingerprint}`);
console.log('');
console.log('Next steps:');
console.log('  1. Add JWT_PRIVATE_KEY and JWT_PUBLIC_KEY to your secrets store.');
console.log('  2. Do NOT commit .env to version control.');
console.log('  3. Rotating keys invalidates all live sessions — coordinate with users.');
