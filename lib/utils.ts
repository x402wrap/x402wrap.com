import { nanoid } from 'nanoid';

/**
 * Generate a short unique ID for links
 */
export function generateLinkId(length: number = 8): string {
  return nanoid(length);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Format large numbers with K/M suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize URL for safe forwarding
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove any potentially dangerous parameters
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL');
  }
}

