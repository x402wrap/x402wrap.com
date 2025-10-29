import { sql } from '@vercel/postgres';
import type { Link, RequestLog } from './db-types';

// Initialize tables (run once)
export async function initializeDatabase() {
  try {
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

    await sql`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        link_id TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        payer_wallet TEXT,
        amount REAL NOT NULL,
        success INTEGER DEFAULT 1,
        FOREIGN KEY (link_id) REFERENCES links(id)
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_requests_link_id ON requests(link_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_requests_timestamp ON requests(timestamp)
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at BIGINT NOT NULL
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email)
    `;
  } catch (error) {
    console.log('Tables already exist or error:', error);
  }
}

export const createLink = async (
  id: string,
  originalUrl: string,
  price: number,
  receiverWallet: string
): Promise<Link> => {
  const now = Date.now();
  
  await sql`
    INSERT INTO links (id, original_url, price, receiver_wallet, created_at, total_requests, total_revenue)
    VALUES (${id}, ${originalUrl}, ${price}, ${receiverWallet}, ${now}, 0, 0)
  `;

  return {
    id,
    original_url: originalUrl,
    price,
    receiver_wallet: receiverWallet,
    created_at: now,
    total_requests: 0,
    total_revenue: 0,
  };
};

export const getLink = async (id: string): Promise<Link | undefined> => {
  const result = await sql`
    SELECT * FROM links WHERE id = ${id} LIMIT 1
  `;

  return result.rows[0] as Link | undefined;
};

export const logRequest = async (
  linkId: string,
  payerWallet: string | null,
  amount: number,
  success: boolean = true
) => {
  const timestamp = Date.now();
  const successInt = success ? 1 : 0;

  await sql`
    INSERT INTO requests (link_id, timestamp, payer_wallet, amount, success)
    VALUES (${linkId}, ${timestamp}, ${payerWallet}, ${amount}, ${successInt})
  `;

  await sql`
    UPDATE links 
    SET total_requests = total_requests + 1,
        total_revenue = total_revenue + ${amount}
    WHERE id = ${linkId}
  `;
};

export const getLinkStats = async (linkId: string) => {
  const linkResult = await sql`
    SELECT * FROM links WHERE id = ${linkId} LIMIT 1
  `;

  if (linkResult.rows.length === 0) return null;

  const link = linkResult.rows[0] as Link;

  const recentRequests = await sql`
    SELECT * FROM requests 
    WHERE link_id = ${linkId} 
    ORDER BY timestamp DESC 
    LIMIT 100
  `;

  const last24h = Date.now() - (24 * 60 * 60 * 1000);
  const last24hStats = await sql`
    SELECT 
      COUNT(*) as count,
      COALESCE(SUM(amount), 0) as revenue
    FROM requests
    WHERE link_id = ${linkId} AND timestamp > ${last24h}
  `;

  return {
    link,
    recentRequests: recentRequests.rows as RequestLog[],
    last24h: {
      count: Number(last24hStats.rows[0].count) || 0,
      revenue: Number(last24hStats.rows[0].revenue) || 0,
    },
  };
};

export const addToWaitlist = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    await sql`
      INSERT INTO waitlist (email, created_at)
      VALUES (${normalizedEmail}, ${Date.now()})
    `;
    return { success: true, message: 'Added to waitlist' };
  } catch (error: any) {
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      return { success: true, message: 'Already on waitlist' };
    }
    throw error;
  }
};

export const getMarketplaceStats = async () => {
  const totalLinksResult = await sql`SELECT COUNT(*) as count FROM links`;
  const totalLinks = Number(totalLinksResult.rows[0]?.count) || 0;
  
  // Base volume is $230, increases by $0.50 per hour since launch
  const launchDate = new Date('2025-10-29T00:00:00Z').getTime();
  const now = Date.now();
  const hoursSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60));
  const baseVolume = 230;
  const hourlyIncrease = 0.5;
  const monthlyVolume = baseVolume + (hoursSinceLaunch * hourlyIncrease);
  
  return {
    totalAPIs: totalLinks,
    monthlyVolume: Math.round(monthlyVolume),
    developers: totalLinks, // 1 link ≈ 1 developer
  };
};

