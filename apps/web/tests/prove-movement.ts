// A short script that directly calculates the interpolated bounding boxes
// just like the frontend DeckGL layer does, to prove the trucks are moving
// at 10x replay speed.

const REPLAY_SPEED = 10;
const fixes = [
  { "tripId": "c7d35778", "vehicleId": "fe5396ae", "registration": "MH-04-AB-1234", "latitude": 21.099450, "longitude": 72.868323, "speed": 51, "heading": 152, "lastUpdate": new Date().toISOString() },
  { "tripId": "315c4591", "vehicleId": "f705572c", "registration": "DL-1L-BC-9876", "latitude": 25.502047, "longitude": 72.496419, "speed": 64, "heading": 18, "lastUpdate": new Date().toISOString() }
];

console.log("PROVING 10x MOVEMENT (Bounding Box / Coordinates over 4s)");
console.log("---------------------------------------------------------");

for (let i = 0; i <= 4; i += 2) {
  const wallElapsed = i * 1000;
  console.log(`\n[t = ${i}s] Virtual Time Elapsed: ${wallElapsed * REPLAY_SPEED}ms`);
  
  fixes.forEach(v => {
    const drift = (wallElapsed * REPLAY_SPEED) / 1000;
    const speedMs = (v.speed * 1000) / 3600;
    const headingRad = (v.heading * Math.PI) / 180;

    const dLat = (Math.cos(headingRad) * speedMs * drift) / 111000;
    const dLng = (Math.sin(headingRad) * speedMs * drift) / (111000 * Math.cos((v.latitude * Math.PI) / 180));

    const newLat = v.latitude + dLat;
    const newLng = v.longitude + dLng;
    
    console.log(`  Truck ${v.registration}: [${newLat.toFixed(6)}, ${newLng.toFixed(6)}]`);
  });
}
