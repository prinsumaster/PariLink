const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const API_URL = 'http://localhost:8080/api/v1';

async function main() {
  const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures.json'), 'utf8'));
  const companyAId = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'A');
  const compA = fixtures.companies[companyAId];
  const invoiceId = compA.entities.invoiceId;
  const connectionId = fs.readFileSync(path.join(__dirname, '../../../apps/api/connectionId.txt'), 'utf8').trim();
  
  const payload1 = {
    id: `evt_${Date.now()}_1`,
    event_type: 'invoice_paid',
    data: {
      invoice_id: invoiceId,
      amount: 1000 // invoice amount
    }
  };
  
  const payload2 = {
    id: `evt_${Date.now()}_2`,
    event_type: 'invoice_paid',
    data: {
      invoice_id: invoiceId,
      amount: 1000 // invoice amount
    }
  };

  const secret = 'test_secret';
  const sig1 = crypto.createHmac('sha256', secret).update(JSON.stringify(payload1)).digest('hex');
  const sig2 = crypto.createHmac('sha256', secret).update(JSON.stringify(payload2)).digest('hex');

  const p1 = axios.post(`${API_URL}/webhooks/v1/incoming/QUICKBOOKS/${connectionId}`, payload1, {
    headers: { 'x-webhook-signature': sig1 },
    validateStatus: () => true
  });
  
  const p2 = axios.post(`${API_URL}/webhooks/v1/incoming/QUICKBOOKS/${connectionId}`, payload2, {
    headers: { 'x-webhook-signature': sig2 },
    validateStatus: () => true
  });

  const [res1, res2] = await Promise.all([p1, p2]);
  
  console.log(`=== ATTACK A4: Payment Integrity (Concurrent Webhooks) ===`);
  console.log(`Invoice ID: ${invoiceId}`);
  console.log(`Req 1 Status: ${res1.status}, data: ${JSON.stringify(res1.data)}`);
  console.log(`Req 2 Status: ${res2.status}, data: ${JSON.stringify(res2.data)}`);
  
  // Wait a moment for EventStore and FinOpsOrchestrator to process
  await new Promise(resolve => setTimeout(resolve, 2000));
}

main().catch(console.error);
