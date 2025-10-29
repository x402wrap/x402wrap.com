import { NextRequest, NextResponse } from 'next/server';
import { getLink, logRequest } from '@/lib/db';
import { verifyPayment, generatePaymentRequest } from '@/lib/solana';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, params);
}

async function handleRequest(request: NextRequest, params: { id: string }) {
  try {
    const { id } = params;

    // Get link from database
    const link = await getLink(id);

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Check for payment proof in headers
    const headers = request.headers;
    const hasPaymentProof = headers.get('x-payment-signature');

    if (!hasPaymentProof) {
      // Return 402 Payment Required with payment details
      const paymentRequest = generatePaymentRequest(
        link.receiver_wallet,
        link.price
      );

      return NextResponse.json(
        {
          error: 'Payment Required',
          payment: {
            recipient: paymentRequest.recipient,
            amount: paymentRequest.amount,
            currency: 'USDC',
            reference: paymentRequest.reference,
          },
          instructions: {
            header: 'x-payment-signature',
            description: 'Include your transaction signature in the x-payment-signature header',
            example: 'x-payment-signature: 5J7Xk...',
          },
        },
        {
          status: 402,
          headers: {
            'X-Payment-Required': 'true',
            'X-Payment-Amount': link.price.toString(),
            'X-Payment-Currency': 'USDC',
            'X-Payment-Recipient': link.receiver_wallet,
          },
        }
      );
    }

    // Verify payment
    const paymentVerification = await verifyPayment(
      headers,
      link.receiver_wallet,
      link.price
    );

    if (!paymentVerification.verified) {
      return NextResponse.json(
        {
          error: 'Payment verification failed',
          details: paymentVerification.error,
        },
        { status: 402 }
      );
    }

    // Log the request
    await logRequest(
      link.id,
      paymentVerification.payer || null,
      link.price,
      true
    );

    // Forward the request to the original API
    try {
      const originalUrl = new URL(link.original_url);
      const requestUrl = new URL(request.url);
      
      // Preserve query parameters
      requestUrl.searchParams.forEach((value, key) => {
        originalUrl.searchParams.set(key, value);
      });

      // Forward headers (excluding payment headers)
      const forwardHeaders = new Headers();
      request.headers.forEach((value, key) => {
        if (!key.startsWith('x-payment-') && !key.startsWith('host')) {
          forwardHeaders.set(key, value);
        }
      });

      // Get request body if present
      let body = null;
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
          body = await request.text();
        } catch {
          // Body might be empty
        }
      }

      // Forward request
      const response = await fetch(originalUrl.toString(), {
        method: request.method,
        headers: forwardHeaders,
        body: body,
      });

      // Get response body
      const responseBody = await response.text();

      // Return the response from original API
      return new NextResponse(responseBody, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
          'X-Forwarded-By': 'x402wrap',
          'X-Payment-Verified': 'true',
        },
      });
    } catch (error) {
      console.error('Error forwarding request:', error);
      return NextResponse.json(
        { error: 'Failed to forward request to original API' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

