import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Create links table
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        id TEXT PRIMARY KEY,
        original_url TEXT NOT NULL,
        price REAL NOT NULL,
        receiver_wallet TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        total_requests INTEGER DEFAULT 0,
        total_revenue REAL DEFAULT 0
      )
    `;

    // Create requests table
    await sql`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        link_id TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        payer_wallet TEXT,
        amount REAL NOT NULL,
        success INTEGER DEFAULT 1
      )
    `;

    // Create waitlist table
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at BIGINT NOT NULL
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_requests_link_id ON requests(link_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_requests_timestamp ON requests(timestamp)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email)`;

    return NextResponse.json({
      success: true,
      message: 'Database tables initialized successfully',
    });
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

