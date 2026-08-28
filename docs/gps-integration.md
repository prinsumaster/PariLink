# PariLink — Connecting a Real GPS Device

_"So how does my tracker connect?"_ — answered in one page.

---

## Quick Answer

Real GPS devices use the same endpoint the demo data populates.  
There is **no code change needed** to switch from demo to live — only the data source changes.

---

## The Data Path

```
GPS Tracker (vehicle) ──HTTPS──▶ POST /fleet/iot/webhook/:providerId
                                         │
                                   HMAC-SHA256 verified
                                         │
                                   IoTService.ingestTelemetry()
                                         │
                                   VehicleLocation table (Postgres)
                                         │
                              GET /dispatch/operations/live-fleet/map
                                         │
                                   DispatchFleetMap (React/deck.gl)
```

---

## Endpoint

```
POST /fleet/iot/webhook/:providerId
```

| Header | Value |
|---|---|
| `x-api-key` | Your PariLink IoT API key (issued per integration) |
| `x-provider-signature` | `HMAC-SHA256(rawBody, webhookSecret)` — hex string |
| `Content-Type` | `application/json` |

`:providerId` — any short identifier for your tracker brand (e.g. `loconav`, `samsara`, `erpnxt`).

---

## Payload Format

```json
{
  "companyId": "<your-company-uuid>",
  "vehicleId": "<vehicle-registration-number-OR-uuid>",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "speed": 58,
  "heading": 270,
  "timestamp": "2026-08-28T09:00:00.000Z"
}
```

**Fields**

| Field | Type | Required | Notes |
|---|---|---|---|
| `companyId` | UUID string | ✅ | Your tenant ID |
| `vehicleId` | string | ✅ | Must match `Vehicle.licensePlate` or `Vehicle.id` |
| `latitude` | float | ✅ | WGS-84 decimal degrees |
| `longitude` | float | ✅ | WGS-84 decimal degrees |
| `speed` | float | — | km/h |
| `heading` | float | — | degrees clockwise from North (0–360) |
| `timestamp` | ISO 8601 string | — | GPS fix time; defaults to `now()` |

---

## HMAC Signature

```python
import hmac, hashlib

raw_body = b'{"companyId": "...", ...}'   # exact bytes sent
secret   = "your-webhook-secret"           # configured in Integrations > IoT

sig = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
# send as: x-provider-signature: <sig>
```

The webhook secret is configured in **Settings → Integrations → IoT Providers**.

---

## What Changes When You Go Live

| | Demo (seed-telemetry.ts) | Live GPS |
|---|---|---|
| `VehicleLocation.provider` | `DEMO_TELEMETRY` | e.g. `loconav` |
| Source | Prisma seed script | Hardware tracker over HTTPS |
| Map banner | ⚠️ DEMO MODE shown | ✅ hidden (no simulated vehicles) |
| Data frequency | 2-min intervals (historical) | Real-time (recommended: 30s–2min) |

The `isSimulated` flag in `/dispatch/operations/live-fleet/map` drives the demo banner.  
When `provider !== 'DEMO_TELEMETRY'`, `isSimulated` is `false` and the banner disappears automatically.

---

## Supported Integrations (Marketplace)

Popular Indian fleet trackers can be connected via the Marketplace:

- **LocoNav** — native adapter available
- **TrackoBit** — webhook passthrough
- **Fleetx** — API polling adapter
- **Vamosys** — webhook passthrough
- **BSNL Telematics** — webhook passthrough

For a custom tracker, use the generic webhook format above.
