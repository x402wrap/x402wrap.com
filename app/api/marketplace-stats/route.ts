import { NextResponse } from 'next/server';
import { getMarketplaceStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getMarketplaceStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

