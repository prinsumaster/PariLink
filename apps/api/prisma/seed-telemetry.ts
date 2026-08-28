/**
 * prisma/seed-telemetry.ts
 * Idempotent demo telemetry seed — Indian NH freight corridors
 * Run: npx ts-node prisma/seed-telemetry.ts
 * Purge: npx ts-node prisma/seed-telemetry.ts --purge
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PROVIDER = 'DEMO_TELEMETRY';
const COMPANY_ID = '42821801-eb35-410d-adf5-4f86d0f901e2';

// ── Route waypoints (real NH corridors) ────────────────────────────────────
// Format: [lng, lat]
const ROUTES: { name: string; vehiclePlate: string; waypoints: [number, number][]; progressPct: number; status: string }[] = [
  {
    name: 'Ahmedabad → Mumbai (NH48)',
    vehiclePlate: 'MH-04-AB-1234',
    progressPct: 0.55, // mid-journey
    status: 'IN_TRANSIT',
    waypoints: [
      [72.5714, 23.0225], // Ahmedabad
      [72.4400, 22.7200], // Narol (outskirts)
      [72.1500, 22.3000], // Anand bypass
      [72.8333, 21.6700], // Vadodara
      [73.1950, 21.1800], // Bharuch
      [72.8311, 21.1702], // Surat outskirts (slow)
      [72.8311, 21.1702], // Surat halt - fuel stop
      [73.0000, 20.8500], // Navsari
      [73.1040, 20.0059], // Dahanu
      [72.9781, 19.2183], // Vasai-Virar
      [72.8777, 19.0760], // Borivali
      [72.8562, 18.9388], // Mumbai (BKC)
    ],
  },
  {
    name: 'Ahmedabad → Delhi (NH48)',
    vehiclePlate: 'DL-1L-BC-9876',
    progressPct: 0.30,
    status: 'IN_TRANSIT',
    waypoints: [
      [72.5714, 23.0225], // Ahmedabad
      [72.1700, 24.5800], // Mehsana
      [72.4200, 25.2700], // Palanpur
      [72.9600, 26.9100], // Jodhpur bypass
      [73.8600, 27.5800], // Nagaur
      [74.6300, 27.9900], // Sikar
      [75.7800, 28.3800], // Jhunjhunu
      [76.1122, 28.8900], // Rewari
      [76.8513, 28.6300], // Gurgaon
      [77.2090, 28.6139], // New Delhi
    ],
  },
  {
    name: 'Mumbai → Bengaluru (NH48)',
    vehiclePlate: 'GJ-01-AB-5678',
    progressPct: 0.70,
    status: 'IN_TRANSIT',
    waypoints: [
      [72.8562, 18.9388], // Mumbai
      [73.3378, 18.5204], // Pune
      [73.3378, 18.5204], // Pune halt - delivery
      [74.5815, 17.6885], // Satara
      [74.6700, 17.0100], // Kolhapur
      [74.6700, 17.0100], // Kolhapur slow zone
      [74.7900, 16.8300], // Belgaum/Belagavi
      [75.1300, 15.3500], // Dharwad
      [75.6000, 13.1600], // Hassan
      [77.5946, 12.9716], // Bengaluru
    ],
  },
  {
    name: 'Surat → Jaipur (NH48/NH58)',
    vehiclePlate: 'RJ-14-CD-2233',
    progressPct: 0.45,
    status: 'IN_TRANSIT',
    waypoints: [
      [72.8311, 21.1702], // Surat
      [72.9000, 21.6000], // Ankleshwar
      [72.8333, 21.6700], // Vadodara
      [72.1500, 22.3000], // Anand
      [72.5714, 23.0225], // Ahmedabad
      [72.5714, 23.0225], // Ahmedabad halt
      [73.1200, 24.5900], // Beawar
      [74.5700, 26.4500], // Ajmer
      [75.7800, 26.9200], // Jaipur outskirts
      [75.7873, 26.9124], // Jaipur
    ],
  },
  {
    name: 'Chennai → Bengaluru (NH48 short)',
    vehiclePlate: 'TN-22-EF-9900',
    progressPct: 0.85,
    status: 'NEAR_DELIVERY',
    waypoints: [
      [80.2707, 13.0827], // Chennai
      [79.9500, 12.7500], // Tambaram outskirts
      [79.7000, 12.4200], // Kanchipuram
      [78.8200, 12.3000], // Vellore
      [78.1500, 12.9200], // Krishnagiri
      [77.5946, 12.9716], // Bengaluru
    ],
  },
  {
    name: 'Jaipur intra-city loop',
    vehiclePlate: 'KA-01-GH-7711',
    progressPct: 0.20,
    status: 'AT_PICKUP',
    waypoints: [
      [75.7873, 26.9124], // Jaipur central
      [75.8000, 26.9300], // Malviya Nagar
      [75.8200, 26.8900], // Sanganer
      [75.7600, 26.8700], // Tonk Road
      [75.7400, 26.9000], // MI Road
      [75.7873, 26.9124], // Jaipur central (loop)
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function lerp(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function bearing(a: [number, number], b: [number, number]): number {
  const dLng = b[0] - a[0];
  const dLat = b[1] - a[1];
  return ((Math.atan2(dLng, dLat) * 180) / Math.PI + 360) % 360;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

/** Generate evenly-spaced fixes along waypoints every 2 minutes */
function generateFixes(
  waypoints: [number, number][],
  progressPct: number,
  intervalMinutes = 2,
  totalMinutes = 160, // ~80 fixes, 2 each = enough history
): { lat: number; lng: number; speed: number; heading: number; timestamp: Date }[] {
  // Total route distance
  const segLengths: number[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    segLengths.push(haversineKm(waypoints[i], waypoints[i + 1]));
  }
  const totalKm = segLengths.reduce((a, b) => a + b, 0);

  // The "current" position is at progressPct along the route
  // We generate fixes starting from (progressPct - totalMinutes*speed/totalKm) back
  const fixes: { lat: number; lng: number; speed: number; heading: number; timestamp: Date }[] = [];
  const nowMs = Date.now();

  for (let m = -totalMinutes; m <= 0; m += intervalMinutes) {
    const fixTime = new Date(nowMs + m * 60 * 1000);
    const offsetFraction = m / totalMinutes; // -1..0
    // current fraction along route
    const fraction = Math.max(0, Math.min(1, progressPct + offsetFraction * progressPct));

    // Find which segment
    let remaining = fraction * totalKm;
    let pos: [number, number] = waypoints[0];
    let head = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      if (remaining <= segLengths[i] + 1e-9) {
        const t = segLengths[i] > 0 ? remaining / segLengths[i] : 0;
        pos = lerp(waypoints[i], waypoints[i + 1], t);
        head = bearing(waypoints[i], waypoints[i + 1]);
        break;
      }
      remaining -= segLengths[i];
      pos = waypoints[waypoints.length - 1];
      head = bearing(waypoints[waypoints.length - 2], waypoints[waypoints.length - 1]);
    }

    // Realistic speed: highway 50-65 km/h, slow near cities and for stops
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    let speed = rand(50, 65);

    // Slow down near start / end of route (city traffic)
    if (fraction < 0.05 || fraction > 0.93) speed = rand(15, 30);
    else if (fraction < 0.10 || fraction > 0.88) speed = rand(25, 45);

    // Occasional stops (fuel / food): ~5% probability
    const isStop = Math.random() < 0.05;
    if (isStop) speed = 0;

    // Small jitter on position (GPS noise ~20m)
    const jitter = 0.0002;
    pos[0] += (Math.random() - 0.5) * jitter;
    pos[1] += (Math.random() - 0.5) * jitter;

    fixes.push({
      lng: pos[0],
      lat: pos[1],
      speed: Math.round(speed),
      heading: Math.round(head),
      timestamp: fixTime,
    });
  }

  return fixes;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const isPurge = args.includes('--purge');

  console.log('🛰️  PariLink Demo Telemetry Seed');
  console.log(`   Provider namespace: ${PROVIDER}`);

  // Always delete old demo rows first (idempotent)
  // Need to bypass RLS for seed scripts
  const deleted = await prisma.$transaction(async (tx: any) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.vehicleLocation.deleteMany({
      where: { companyId: COMPANY_ID, provider: PROVIDER },
    });
  });
  console.log(`   Purged ${deleted.count} old DEMO_TELEMETRY rows.`);

  if (isPurge) {
    console.log('✅ Purge complete.');
    return;
  }

  let totalInserted = 0;

  for (const route of ROUTES) {
    const vehicle = await prisma.$transaction(async (tx: any) => {
      await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
      return tx.vehicle.findFirst({
        where: { companyId: COMPANY_ID, licensePlate: route.vehiclePlate },
      });
    });

    if (!vehicle) {
      console.warn(`   ⚠️  Vehicle ${route.vehiclePlate} not found — skipping ${route.name}`);
      continue;
    }

    const fixes = generateFixes(route.waypoints, route.progressPct);

    const rows = fixes.map((f) => ({
      companyId: COMPANY_ID,
      provider: PROVIDER,
      providerVehicleId: route.vehiclePlate,
      vehicleId: vehicle.id,
      latitude: f.lat,
      longitude: f.lng,
      speed: f.speed,
      heading: f.heading,
      gpsTimestamp: f.timestamp,
      ignition: f.speed > 0,
    }));

    await prisma.$transaction(async (tx: any) => {
      await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
      await tx.vehicleLocation.createMany({ data: rows });
    });
    totalInserted += rows.length;

    console.log(`   ✓ ${route.name} (${route.vehiclePlate}) — ${rows.length} fixes`);
  }

  // Print sample 5 rows
  const sample = await prisma.$transaction(async (tx: any) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.vehicleLocation.findMany({
      where: { companyId: COMPANY_ID, provider: PROVIDER },
      orderBy: { gpsTimestamp: 'asc' },
      take: 5,
    });
  });

  console.log(`\n✅ Inserted ${totalInserted} total VehicleLocation rows\n`);
  console.log('Sample 5 rows (oldest first):');
  sample.forEach((r) => {
    console.log(
      `  [${r.gpsTimestamp.toISOString()}] plate=${r.providerVehicleId} ` +
        `lat=${r.latitude.toFixed(4)} lng=${r.longitude.toFixed(4)} ` +
        `speed=${r.speed} heading=${r.heading}`,
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
