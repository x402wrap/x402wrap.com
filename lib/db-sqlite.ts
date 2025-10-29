import Database from 'better-sqlite3';
import path from 'path';
import type { Link, RequestLog } from './db-types';

const dbPath = path.join(process.cwd(), 'x402.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    original_url TEXT NOT NULL,
    price REAL NOT NULL,
    receiver_wallet TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    total_requests INTEGER DEFAULT 0,
    total_revenue REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    payer_wallet TEXT,
    amount REAL NOT NULL,
    success INTEGER DEFAULT 1,
    FOREIGN KEY (link_id) REFERENCES links(id)
  );

  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_requests_link_id ON requests(link_id);
  CREATE INDEX IF NOT EXISTS idx_requests_timestamp ON requests(timestamp);
  CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
`);

export const createLink = async (
  id: string,
  originalUrl: string,
  price: number,
  receiverWallet: string
): Promise<Link> => {
  const stmt = db.prepare(`
    INSERT INTO links (id, original_url, price, receiver_wallet, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const now = Date.now();
  stmt.run(id, originalUrl, price, receiverWallet, now);

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
  const stmt = db.prepare('SELECT * FROM links WHERE id = ?');
  return stmt.get(id) as Link | undefined;
};

export const logRequest = async (
  linkId: string,
  payerWallet: string | null,
  amount: number,
  success: boolean = true
) => {
  const stmt = db.prepare(`
    INSERT INTO requests (link_id, timestamp, payer_wallet, amount, success)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(linkId, Date.now(), payerWallet, amount, success ? 1 : 0);

  const updateStmt = db.prepare(`
    UPDATE links 
    SET total_requests = total_requests + 1,
        total_revenue = total_revenue + ?
    WHERE id = ?
  `);

  updateStmt.run(amount, linkId);
};

export const getLinkStats = async (linkId: string) => {
  const link = await getLink(linkId);
  if (!link) return null;

  const recentRequests = db.prepare(`
    SELECT * FROM requests 
    WHERE link_id = ? 
    ORDER BY timestamp DESC 
    LIMIT 100
  `).all(linkId) as RequestLog[];

  const last24h = Date.now() - (24 * 60 * 60 * 1000);
  const last24hStats = db.prepare(`
    SELECT 
      COUNT(*) as count,
      SUM(amount) as revenue
    FROM requests
    WHERE link_id = ? AND timestamp > ?
  `).get(linkId, last24h) as { count: number; revenue: number };

  return {
    link,
    recentRequests,
    last24h: last24hStats,
  };
};

export const addToWaitlist = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const stmt = db.prepare(`
      INSERT INTO waitlist (email, created_at)
      VALUES (?, ?)
    `);
    stmt.run(email.toLowerCase().trim(), Date.now());
    return { success: true, message: 'Added to waitlist' };
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return { success: true, message: 'Already on waitlist' };
    }
    throw error;
  }
};

export const getMarketplaceStats = async () => {
  const totalLinksResult = db.prepare('SELECT COUNT(*) as count FROM links').get() as { count: number };
  const totalLinks = totalLinksResult.count || 0;
  
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

export default db;

