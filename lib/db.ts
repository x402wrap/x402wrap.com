// Use Postgres in production, SQLite in development
const isProduction = process.env.NODE_ENV === 'production';

let dbModule: any;

if (isProduction) {
  // @ts-ignore
  dbModule = require('./db-postgres');
} else {
  // Keep SQLite for local dev
  const Database = require('better-sqlite3');
  const path = require('path');
  const dbPath = path.join(process.cwd(), 'x402.db');
  const db = new Database(dbPath);

// Initialize database schema (only for SQLite in dev)
if (!isProduction) {
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

  CREATE INDEX IF NOT EXISTS idx_requests_link_id ON requests(link_id);
  CREATE INDEX IF NOT EXISTS idx_requests_timestamp ON requests(timestamp);
`);
}

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

export const createLink = async (id: string, originalUrl: string, price: number, receiverWallet: string): Promise<Link> => {
  if (isProduction) {
    return dbModule.createLink(id, originalUrl, price, receiverWallet);
  }
  
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
  if (isProduction) {
    return dbModule.getLink(id);
  }
  
  const stmt = db.prepare('SELECT * FROM links WHERE id = ?');
  return stmt.get(id) as Link | undefined;
};

export const logRequest = async (linkId: string, payerWallet: string | null, amount: number, success: boolean = true) => {
  if (isProduction) {
    return dbModule.logRequest(linkId, payerWallet, amount, success);
  }
  
  const stmt = db.prepare(`
    INSERT INTO requests (link_id, timestamp, payer_wallet, amount, success)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(linkId, Date.now(), payerWallet, amount, success ? 1 : 0);
  
  // Update link statistics
  const updateStmt = db.prepare(`
    UPDATE links 
    SET total_requests = total_requests + 1,
        total_revenue = total_revenue + ?
    WHERE id = ?
  `);
  
  updateStmt.run(amount, linkId);
};

export const getLinkStats = async (linkId: string) => {
  if (isProduction) {
    return dbModule.getLinkStats(linkId);
  }
  
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

export default isProduction ? null : db;

