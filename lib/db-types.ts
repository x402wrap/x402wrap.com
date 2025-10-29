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

