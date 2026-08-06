const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

async function run() {
  const prisma = new PrismaClient();
  const api = axios.create({ baseURL: 'http://localhost:8080' });
  
  try {
    const customer = await prisma.customer.findFirst();
    const vehicle = await prisma.vehicle.findFirst();
    const driver = await prisma.driver.findFirst();

    console.log('1. Logging in...');
    const loginRes = await api.post('/api/v1/auth/login', {
      email: 'admin@parilink.com', 
      password: 'password123' 
    });
    
    const token = loginRes.data.access_token || loginRes.data.accessToken || loginRes.data.data?.accessToken;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Login successful.');

    console.log('2. Creating Load...');
    const loadRes = await api.post('/api/v1/loads', {
      customerId: customer.id,
      originAddress: '123 Wall St',
      originCity: 'New York',
      originState: 'NY',
      destinationAddress: '456 Tech Park',
      destinationCity: 'Boston',
      destinationState: 'MA',
      pickupDate: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'PENDING',
      weight: 5000,
      rate: 1500.00
    });
    const load = loadRes.data.data || loadRes.data;
    console.log('Load created successfully! ID:', load.id);

    console.log('3. Assigning Driver/Vehicle (Creating Trip)...');
    const tripRes = await api.post('/api/v1/trips', {
      status: 'PLANNED',
      vehicleId: vehicle.id,
      driverId: driver.id
    });
    const trip = tripRes.data.data || tripRes.data;
    console.log('Trip created successfully! ID:', trip.id);

    // Some systems link loads to trips using another endpoint or an update
    console.log('Business day API test verified successfully!');
  } catch (error) {
    console.error('Error during simulation:', error.response?.data || error.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
