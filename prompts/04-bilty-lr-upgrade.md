# Prompt 04 — Bilty / LR generation (proper, GST-ready, PDF, WhatsApp-ready)

Upgrade the Lorry Receipt into a real, printable, multi-copy GST bilty that auto-fills from the booking/
trip. Rules: commit per step, `tsc`=0, real PDF (not blank), no fake data, screenshot gate.

## Backend (`apps/api/src/lorry-receipts`)
- Generate a Bilty from a trip: consignor, consignee, from→to, goods, packages, weight, freight, GST
  (CGST/SGST or IGST 5%), e-way bill no, LR number (branch-wise series), driver + truck.
- `GET /bilty/:id/pdf` — render a proper A4 PDF with all fields + GST breakup + HSN/SAC 9965 + amount in
  words + copy label (Consignor / Consignee / Driver / Office / POD).
- Support **multi-copy** (a query param `?copy=consignor|consignee|driver|office|pod`), reprint tracking,
  and cancellation (status CANCELLED, reason).

## Frontend
- Bilty detail page: all fields, a copy selector, "Print / Download PDF", and (stub ok) a "Send on
  WhatsApp" button that prepares the PDF (real WhatsApp send comes in prompt 10-area / later).
- Auto-fill from the trip's booking so nothing is retyped.

## VERIFY (screenshot gate)
- Curl `GET /bilty/:id/pdf` → returns a non-empty PDF (check `Content-Type: application/pdf` and size).
- Screenshots: bilty detail page (populated), and the generated PDF showing GST breakup + copy label.
## REPORT
Paste the PDF curl (type + size), `tsc`=0, and the 2 screenshots. Do NOT say done if the PDF is blank
or the GST breakup is missing/wrong.
