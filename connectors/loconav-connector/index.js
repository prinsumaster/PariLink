const axios = require('axios');

// Simulation of an external Serverless Function (e.g. AWS Lambda or PariLink AppEngine Worker)
// This app runs completely independently from the PariLink Core API.

const PARILINK_INGRESS_URL = process.env.PARILINK_INGRESS_URL || 'http://localhost:3000/ingress/telemetry';
const APP_ID = process.env.APP_ID || 'APP_LOCONAV_123';
const COMPANY_ID = process.env.COMPANY_ID || 'COMP_999';
const SECRET_KEY = process.env.SECRET_KEY || 'sk_live_abc123';
const LOCONAV_API_KEY = process.env.LOCONAV_API_KEY || 'fake_loconav_token';

async function fetchLocoNavData() {
  console.log(`[LocoNav Connector] Fetching data from LocoNav for customer...`);
  // Mocking the LocoNav API response
  return [
    {
      vehicle_number: 'KA-01-AB-1234',
      lat: 12.9716,
      lng: 77.5946,
      speed: 45,
      ignition_status: true,
      last_updated_at: new Date().toISOString()
    },
    {
      vehicle_number: 'MH-02-XY-9876',
      lat: 19.0760,
      lng: 72.8777,
      speed: 0,
      ignition_status: false,
      last_updated_at: new Date().toISOString()
    }
  ];
}

function transformToPariLinkStandard(loconavData) {
  console.log(`[LocoNav Connector] Transforming ${loconavData.length} records to PariLink Standard...`);
  return loconavData.map(v => ({
    providerVehicleId: v.vehicle_number,
    latitude: v.lat,
    longitude: v.lng,
    speed: v.speed,
    heading: 0, // LocoNav mock might not have it
    ignition: v.ignition_status,
    gpsTimestamp: v.last_updated_at
  }));
}

async function pushToPariLink(records) {
  console.log(`[LocoNav Connector] Pushing to PariLink Ingress: ${PARILINK_INGRESS_URL}`);
  
  const payload = {
    appId: APP_ID,
    secretKey: SECRET_KEY,
    companyId: COMPANY_ID,
    records: records
  };

  try {
    const response = await axios.post(PARILINK_INGRESS_URL, payload);
    console.log(`[LocoNav Connector] SUCCESS: PariLink responded with status ${response.status}`);
    console.log(response.data);
  } catch (error) {
    console.error(`[LocoNav Connector] ERROR pushing to PariLink:`, error.message);
    if (error.response) {
      console.error(error.response.data);
    }
  }
}

async function runSyncCycle() {
  console.log('--- Starting Sync Cycle ---');
  const rawData = await fetchLocoNavData();
  const normalizedData = transformToPariLinkStandard(rawData);
  await pushToPariLink(normalizedData);
  console.log('--- End Sync Cycle ---\n');
}

// In production, this might be triggered by a CloudWatch Event (Cron) every 10 seconds.
runSyncCycle();
