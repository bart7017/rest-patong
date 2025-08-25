import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://127.0.0.1:3003/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'API not accessible' }, { status: 500 });
  }
}