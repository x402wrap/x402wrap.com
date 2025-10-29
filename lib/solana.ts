import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

// Use Solana mainnet or devnet
const SOLANA_RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC, 'confirmed');

// USDC Mint Address on Solana mainnet
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

export interface PaymentRequest {
  recipient: string;
  amount: number; // Amount in USDC
  reference?: string;
}

export interface PaymentVerification {
  verified: boolean;
  signature?: string;
  amount?: number;
  payer?: string;
  error?: string;
}

/**
 * Verify x402 payment from request headers
 * In a real implementation, this would:
 * 1. Check the x402 payment header
 * 2. Verify the transaction signature on Solana
 * 3. Confirm the payment amount and recipient
 */
export async function verifyPayment(
  headers: Headers,
  expectedRecipient: string,
  expectedAmount: number
): Promise<PaymentVerification> {
  try {
    // Check for x402 payment header
    const paymentProof = headers.get('x-payment-signature');
    const paymentFrom = headers.get('x-payment-from');
    
    if (!paymentProof) {
      return {
        verified: false,
        error: 'No payment proof provided. Please include x-payment-signature header.',
      };
    }

    // Verify the transaction exists and is confirmed
    try {
      const signature = paymentProof;
      const tx = await connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        return {
          verified: false,
          error: 'Transaction not found or not confirmed',
        };
      }

      // Verify transaction details
      // In production, you'd check:
      // 1. The recipient matches
      // 2. The amount is correct (in USDC SPL token transfer)
      // 3. Transaction is recent (within last few minutes)
      
      return {
        verified: true,
        signature: signature,
        amount: expectedAmount,
        payer: paymentFrom || undefined,
      };
    } catch (err) {
      return {
        verified: false,
        error: 'Invalid transaction signature',
      };
    }
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}

/**
 * Generate payment request details for x402 protocol
 */
export function generatePaymentRequest(recipient: string, amount: number): PaymentRequest {
  return {
    recipient,
    amount,
    reference: Math.random().toString(36).substring(7),
  };
}

/**
 * Validate Solana wallet address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey.toBytes());
  } catch {
    return false;
  }
}

/**
 * Format USDC amount for display
 */
export function formatUSDC(amount: number): string {
  return amount.toFixed(6);
}

export { connection };

