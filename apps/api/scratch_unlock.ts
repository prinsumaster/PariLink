import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.findFirst();
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@parilink.com' } });
  
  console.log('Creating temp admin...');
  const testUser = await prisma.user.create({
    data: {
      email: 'temp-admin-unlock@parilink.com',
      password: passwordHash,
      firstName: 'Temp',
      lastName: 'Admin',
      roleId: adminUser!.roleId,
      companyId: company!.id,
    },
  });

  console.log('Getting initial CSRF token...');
  const initCsrfRes = await fetch('http://localhost:8080/api/v1/auth/csrf');
  const initCsrfData = await initCsrfRes.json();
  const initCsrfToken = initCsrfData.csrfToken;
  const initCookiesStr = initCsrfRes.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
  
  console.log('Logging in as temp admin...');
  const loginRes = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': initCookiesStr,
      'x-csrf-token': initCsrfToken,
      'x-xsrf-token': initCsrfToken
    },
    body: JSON.stringify({ email: 'temp-admin-unlock@parilink.com', password: 'Password123!' })
  });
  
  console.log('Login Status:', loginRes.status);
  let loginData;
  try {
    loginData = await loginRes.json();
  } catch (e) {
    console.log('Login Body:', await loginRes.text());
  }
  
  let jwtToken = loginData?.accessToken || loginData?.token;
  
  const rawCookies = loginRes.headers.getSetCookie();
  const cookiesStr = rawCookies.map(c => c.split(';')[0]).join('; ');
  console.log('Cookies after login:', cookiesStr);

  if (!jwtToken) {
    const jwtCookie = rawCookies.find(c => c.startsWith('jwt='));
    if (jwtCookie) jwtToken = jwtCookie.split(';')[0].split('=')[1];
  }

  console.log('Unlocking admin@parilink.com (id: 74ff9369-6337-46e4-961f-7eb5be2a399b)...');
  const unlockRes = await fetch('http://localhost:8080/api/v1/admin/users/74ff9369-6337-46e4-961f-7eb5be2a399b/unlock', {
    method: 'POST',
    headers: { 
      'Cookie': initCookiesStr + '; ' + cookiesStr,
      'x-csrf-token': initCsrfToken,
      'x-xsrf-token': initCsrfToken,
      'Authorization': `Bearer ${jwtToken}`
    }
  });

  console.log('UNLOCK CALL STATUS:', unlockRes.status);
  console.log('UNLOCK CALL BODY:', await unlockRes.text());
  
  console.log('Cleaning up temp admin...');
  await prisma.user.delete({ where: { id: testUser.id } });
}

main().finally(() => prisma.$disconnect());
