// Database layer - uses Postgres in production, SQLite in development
import type { Link, RequestLog } from './db-types';

// Dynamic import based on environment
const isProduction = process.env.NODE_ENV === 'production';

let dbImplementation: any;

async function getDbImplementation() {
  if (!dbImplementation) {
    if (isProduction) {
      dbImplementation = await import('./db-postgres');
    } else {
      dbImplementation = await import('./db-sqlite');
    }
  }
  return dbImplementation;
}

export const createLink = async (
  id: string,
  originalUrl: string,
  price: number,
  receiverWallet: string
): Promise<Link> => {
  const db = await getDbImplementation();
  return db.createLink(id, originalUrl, price, receiverWallet);
};

export const getLink = async (id: string): Promise<Link | undefined> => {
  const db = await getDbImplementation();
  return db.getLink(id);
};

export const logRequest = async (
  linkId: string,
  payerWallet: string | null,
  amount: number,
  success: boolean = true
) => {
  const db = await getDbImplementation();
  return db.logRequest(linkId, payerWallet, amount, success);
};

export const getLinkStats = async (linkId: string) => {
  const db = await getDbImplementation();
  return db.getLinkStats(linkId);
};
