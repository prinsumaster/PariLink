const http = require('http');

async function getAuthToken() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data).access_token); } catch(e) { resolve(null); }
      });
    });
    req.write(JSON.stringify({ email: 'admin@parilink.com', password: 'admin123' }));
    req.end();
  });
}

async function fetchIds(token, endpoint) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/v1/${endpoint}`,
      headers: { Authorization: `Bearer ${token}` }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const arr = JSON.parse(data).data || JSON.parse(data);
          resolve(arr.slice(0, 3).map(i => i.id));
        } catch(e) { resolve([]); }
      });
    });
    req.end();
  });
}

async function run() {
  const token = await getAuthToken();
  const [loads, trips, invoices, customers, vehicles, drivers, warehouses, orders, lorryReceipts] = await Promise.all([
    fetchIds(token, 'loads'), fetchIds(token, 'trips'), fetchIds(token, 'invoices'),
    fetchIds(token, 'customers'), fetchIds(token, 'vehicles'), fetchIds(token, 'drivers'),
    fetchIds(token, 'warehouses'), fetchIds(token, 'orders'), fetchIds(token, 'lorry-receipts')
  ]);
  const routes = [
    '/dashboard', '/customers', '/fleet', '/drivers', '/loads', '/trips', '/vendors', '/billing',
    '/analytics/command-center', '/finance', '/finance/bank-statements', '/finance/payroll',
    '/wms', '/orders', '/reports', '/notifications', '/operations'
  ];
  loads.forEach(id => routes.push(`/loads/${id}`));
  trips.forEach(id => routes.push(`/trips/${id}`));
  invoices.forEach(id => routes.push(`/finance/${id}`));
  customers.forEach(id => routes.push(`/customers/${id}`));
  vehicles.forEach(id => routes.push(`/fleet/${id}`));
  drivers.forEach(id => routes.push(`/drivers/${id}`));
  warehouses.forEach(id => routes.push(`/wms/${id}`));
  orders.forEach(id => routes.push(`/orders/${id}`));
  lorryReceipts.forEach(id => routes.push(`/lorry-receipts/${id}`));
  
  console.log(`Warming up ${routes.length} routes...`);
  for (const r of routes) {
    console.log('Warming ' + r);
    await new Promise(res => {
      http.get({ hostname: 'localhost', port: 3000, path: r }, () => res()).on('error', () => res());
    });
  }
  console.log('Done warmup!');
}
run();
