import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const initCsrfRes = await fetch('http://localhost:8080/api/v1/auth/csrf');
  const initCsrfData = await initCsrfRes.json();
  const initCsrfToken = initCsrfData.csrfToken;
  const initCookiesStr = initCsrfRes.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
  
  console.log('Logging in as admin...');
  const loginRes = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': initCookiesStr,
      'x-csrf-token': initCsrfToken,
      'x-xsrf-token': initCsrfToken
    },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'Password123!' })
  });
  
  console.log('Login Status:', loginRes.status);
  console.log('Login Body:', await loginRes.text());
}

main().finally(() => prisma.$disconnect());
