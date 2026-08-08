import * as dns from 'dns';
import * as url from 'url';

/**
 * Enterprise SSRF Protection
 * Prevents requests to local, loopback, private, and cloud metadata IPs.
 */
export async function validateSsrfSafeUrl(targetUrl: string): Promise<boolean> {
  try {
    const parsed = new url.URL(targetUrl);

    // 1. Enforce HTTPS (except for local dev if explicitly bypassed, but enterprise defaults to HTTPS)
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname;

    // 2. Initial string match to prevent obvious loopback/metadata
    const blockedHostnames = [
      'localhost',
      '127.0.0.1',
      '169.254.169.254',
      '0.0.0.0',
    ];
    if (blockedHostnames.includes(hostname)) {
      return false;
    }

    // 3. DNS resolution to prevent DNS rebinding or obfuscated IPs
    const addresses = await dns.promises.resolve(hostname);

    for (const address of addresses) {
      if (isPrivateIp(address)) {
        return false;
      }
    }

    return true;
  } catch (err) {
    return false;
  }
}

function isPrivateIp(ip: string): boolean {
  // IPv4 Private Blocks
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;

  if (ip.startsWith('172.')) {
    const secondOctet = parseInt(ip.split('.')[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }

  // Cloud metadata and loopback
  if (ip === '169.254.169.254') return true;
  if (ip.startsWith('127.')) return true;
  if (ip === '0.0.0.0') return true;

  // IPv6 Private/Loopback (simplified)
  if (ip === '::1') return true;
  if (ip.startsWith('fc00:')) return true;
  if (ip.startsWith('fd00:')) return true;
  if (ip.startsWith('fe80:')) return true;

  return false;
}
