// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — OCR / Document Intelligence Service
// Uses react-native-mlkit for on-device text recognition (no cloud needed).
// Structured extraction handles Fuel Receipts, Toll Slips, POD details.
// ─────────────────────────────────────────────────────────────────────────────

import { Platform } from 'react-native';

// MLKit text recognition (on-device, offline)
// import MLKit from 'react-native-mlkit'; // Uncomment once linked

export interface OcrResult {
  rawText:   string;
  extracted: {
    amount?:     number;
    currency?:   string;
    date?:       string;
    vendorName?: string;
    invoiceNo?:  string;
    fuelLitres?: number;
  };
  confidence: number;
}

const AMOUNT_PATTERN    = /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
const DATE_PATTERN      = /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/;
const INVOICE_PATTERN   = /(?:invoice|bill|receipt)\s*#?\s*:?\s*([A-Z0-9\-]{4,20})/i;
const FUEL_LITRE_PATTERN = /([\d.]+)\s*(?:L|ltr|litre|liters)/i;

/**
 * Parse raw OCR text into a structured expense object.
 */
export function parseOcrText(rawText: string): OcrResult['extracted'] {
  const extracted: OcrResult['extracted'] = {};

  const amountMatch = rawText.match(AMOUNT_PATTERN);
  if (amountMatch) {
    extracted.amount   = parseFloat(amountMatch[1].replace(/,/g, ''));
    extracted.currency = 'INR';
  }

  const dateMatch = rawText.match(DATE_PATTERN);
  if (dateMatch) {
    extracted.date = dateMatch[1];
  }

  const invoiceMatch = rawText.match(INVOICE_PATTERN);
  if (invoiceMatch) {
    extracted.invoiceNo = invoiceMatch[1];
  }

  const fuelMatch = rawText.match(FUEL_LITRE_PATTERN);
  if (fuelMatch) {
    extracted.fuelLitres = parseFloat(fuelMatch[1]);
  }

  return extracted;
}

export const OcrService = {
  /**
   * Recognise text in a local image URI.
   * Falls back gracefully to a stub in environments where MLKit is not linked.
   */
  async recognise(imageUri: string): Promise<OcrResult> {
    try {
      // When MLKit is fully linked:
      // const result = await MLKit.textRecognition().processImage(imageUri);
      // const rawText = result.blocks.map(b => b.text).join('\n');

      // ── Stub for dev / build without native link ──────────────────────────
      console.log('[OcrService] Processing image:', imageUri, 'on', Platform.OS);
      const rawText = ''; // Replace with actual MLKit output after native link
      // ──────────────────────────────────────────────────────────────────────

      const extracted = parseOcrText(rawText);
      return { rawText, extracted, confidence: rawText.length > 0 ? 0.85 : 0 };
    } catch (error) {
      console.error('[OcrService] Recognition failed:', error);
      return { rawText: '', extracted: {}, confidence: 0 };
    }
  },
};
