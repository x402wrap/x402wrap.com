import { sql } from '@vercel/postgres';

export interface Link {
  id: string;
  original_url: string;
  price: number;
  receiver_wallet: string;
  created_at: number;
  total_requests: number;
  total_revenue: number;
}

export interface RequestLog {
  id: number;
  link_id: string;
  timestamp: number;
  payer_wallet: string | null;
  amount: number;
  success: number;
}

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

