import { NextRequest, NextResponse } from 'next/server';
import { createLink } from '@/lib/db';
import { generateLinkId, isValidUrl } from '@/lib/utils';
import { isValidSolanaAddress } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiUrl, price, wallet } = body;

    // Validation
    if (!apiUrl || !price || !wallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidUrl(apiUrl)) {
      return NextResponse.json(
        { error: 'Invalid API URL' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price <= 0 || price > 1000) {
      return NextResponse.json(
        { error: 'Price must be between 0 and 1000 USDC' },
        { status: 400 }
      );
    }

    if (!isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = generateLinkId();

    // Create link in database
    const link = await createLink(id, apiUrl, price, wallet);

    return NextResponse.json({
      id: link.id,
      url: apiUrl,
      price: link.price,
      wallet: link.receiver_wallet,
    });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

