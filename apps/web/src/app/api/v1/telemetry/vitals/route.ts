import { NextResponse } from 'next/server';

export async function POST() {
  // Mock endpoint to consume web vitals telemetry
  return NextResponse.json({ success: true }, { status: 200 });
}
