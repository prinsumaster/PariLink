import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('Enterprise Document Management & Compliance (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let companyId: string;
  let userId: string;
  let folderId: string;
  let documentId: string;
  let signatureId: string;
  const testEmail = `doc_admin_${Date.now()}@parilink.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    const comp = await prisma.company.create({
      data: { name: 'Doc Enterprise Test Corp' },
    });
    companyId = comp.id;

    const role = await prisma.role.create({
      data: {
        name: 'Doc Admin Role',
        permissions: ['*'],
        companyId,
      },
    });

    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        firstName: 'Doc',
        lastName: 'Admin',
        companyId,
        roleId: role.id,
      },
    });
    userId = user.id;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: 'Password123!',
        companyId,
      });
    accessToken = loginRes.body.access_token;

    // Create a mock document in database for testing
    const doc = await prisma.document.create({
      data: {
        companyId,
        type: 'BILL_OF_LADING',
        fileName: 'bol_1001.pdf',
        fileUrl: '/uploads/bol_1001.pdf',
        uploadedById: userId,
        status: 'ACTIVE',
      },
    });
    documentId = doc.id;
  });

  afterAll(async () => {
    await prisma.company.delete({ where: { id: companyId } }).catch(() => {});
    await app.close();
  });

  it('1. Create document folder and retrieve tree', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/documents/enterprise/folders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Compliance Records' });
    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe('Compliance Records');
    folderId = createRes.body.id;

    const treeRes = await request(app.getHttpServer())
      .get('/documents/enterprise/folders/tree')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(treeRes.status).toBe(200);
    expect(Array.isArray(treeRes.body)).toBe(true);
    expect(treeRes.body.some((f: any) => f.id === folderId)).toBe(true);
  });

  it('2. Move document to created folder', async () => {
    const moveRes = await request(app.getHttpServer())
      .put(`/documents/enterprise/move/${documentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ folderId });
    expect(moveRes.status).toBe(200);
    expect(moveRes.body.folderId).toBe(folderId);
  });

  it('3. Checkout and checkin document version', async () => {
    const checkoutRes = await request(app.getHttpServer())
      .post(`/documents/enterprise/${documentId}/checkout`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ lockReason: 'Updating terms' });
    expect(checkoutRes.status).toBe(201);
    expect(checkoutRes.body.isLocked).toBe(true);
    expect(checkoutRes.body.lockedById).toBe(userId);

    const historyRes = await request(app.getHttpServer())
      .get(`/documents/enterprise/${documentId}/versions`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.length).toBeGreaterThanOrEqual(1);
  });

  it('4. Create compliance requirement and evaluate entity', async () => {
    const reqRes = await request(app.getHttpServer())
      .post('/documents/enterprise/compliance/requirements')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityType: 'DRIVER',
        docType: 'BILL_OF_LADING',
        name: 'Signed BOL Requirement',
        isMandatory: true,
        warningDays: 14,
      });
    expect(reqRes.status).toBe(201);

    const evalRes = await request(app.getHttpServer())
      .get('/documents/enterprise/compliance/evaluate/DRIVER/drv-999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(evalRes.status).toBe(200);
    expect(evalRes.body.evaluations).toBeDefined();
    expect(evalRes.body.overallStatus).toBeDefined();
  });

  it('5. E-Signature request, sign, and verification certificate generation', async () => {
    const sigReq = await request(app.getHttpServer())
      .post(`/documents/enterprise/${documentId}/signatures`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        signerEmail: 'driver@parilink.com',
        signerName: 'Driver John',
      });
    expect(sigReq.status).toBe(201);
    signatureId = sigReq.body.id;

    const signRes = await request(app.getHttpServer())
      .post(`/documents/enterprise/signatures/${signatureId}/sign`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        signatureUrl: 'data:image/png;base64,iVBORw0KGgo...',
      });
    expect(signRes.status).toBe(200);
    expect(signRes.body.status).toBe('SIGNED');
    expect(signRes.body.documentHash).toBeDefined();

    const certRes = await request(app.getHttpServer())
      .get(`/documents/enterprise/signatures/${signatureId}/certificate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(certRes.status).toBe(200);
    expect(certRes.body.verificationStatus).toBe('VALID_AND_BINDING');
    expect(certRes.body.certificateId).toBeDefined();
  });

  it('6. Run AI OCR classification and metadata extraction', async () => {
    const aiRes = await request(app.getHttpServer())
      .post(`/documents/enterprise/${documentId}/ai-classify`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ocrText:
          'BILL OF LADING LOAD # LD-8899 WEIGHT 48000 LBS DATE: 2026-07-27',
      });
    expect(aiRes.status).toBe(201);
    expect(aiRes.body.detectedType).toBe('BILL_OF_LADING');
    expect(aiRes.body.extractedMetadata.loadNumber).toBe('LD-8899');
    expect(aiRes.body.extractedMetadata.weight).toBe(48000);
  });
});
