const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/v1/vehicles', {
      type: 'TRUCK',
      make: 'Volvo',
      model: 'VNL',
      year: 2022,
      licensePlate: 'PLATE_123',
      capacityWeight: 40000
    }, {
      headers: {
        'X-Tenant-ID': 'b5f65428-e510-494f-afe8-a175a5ec062d',
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
test();
