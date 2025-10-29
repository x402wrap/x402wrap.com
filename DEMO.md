# 🚀 x402wrap Demo Guide

## Quick Demo

### 1. Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 2. Create Your First Paid API Link

**Example API to monetize:**
- API URL: `https://api.github.com/users/octocat`
- Price: `0.01` USDC
- Wallet: `7xKXtaoaYJVRvpz9B2WuKJ9Qwp6hqC9XYZ1234567890` (example)

### 3. Test the Proxy

Once you generate a link (e.g., `http://localhost:3000/abc123`), try:

**Without payment:**
```bash
curl http://localhost:3000/abc123
```

Response: `402 Payment Required` with payment details

**With payment (simulated):**
```bash
curl http://localhost:3000/abc123 \
  -H "x-payment-signature: test_signature_123" \
  -H "x-payment-from: 7xKXtaoaYJVRvpz9B2WuKJ9Qwp6hqC9XYZ1234567890"
```

Response: The actual API response from the proxied endpoint

### 4. View Analytics

Visit: `http://localhost:3000/stats/abc123`

See real-time statistics including:
- Total requests
- Total revenue
- Recent transactions
- 24-hour stats

## Testing with Real Solana

For production testing with real payments:

1. Use a Solana wallet (Phantom, Solflare)
2. Fund it with USDC on Solana mainnet
3. Make a payment transaction to the receiver wallet
4. Include the transaction signature in the request header

## Example Use Cases

### 1. Monetize a Weather API
```
Original: https://api.weatherapi.com/v1/current.json
x402 Link: http://localhost:3000/weather1
Price: $0.001 per query
```

### 2. Premium Data Feed
```
Original: https://api.coinbase.com/v2/prices/BTC-USD/spot
x402 Link: http://localhost:3000/btcprice
Price: $0.01 per check
```

### 3. AI Model API
```
Original: https://api.yourdomain.com/ml-inference
x402 Link: http://localhost:3000/aimodel
Price: $0.10 per inference
```

## Tips for Production

1. **Use a custom domain**: Deploy to Vercel and use your own domain
2. **Set appropriate pricing**: Consider your costs and target audience
3. **Monitor analytics**: Track usage patterns and adjust pricing
4. **Secure your wallet**: Use a dedicated wallet for receiving payments
5. **Test thoroughly**: Verify payment verification works correctly

## Architecture Overview

```
Client Request
    ↓
x402wrap Proxy (checks payment)
    ↓
Payment Verification (Solana)
    ↓
Forward to Original API
    ↓
Return Response + Log Stats
```

## Next Steps

- Deploy to production (Vercel recommended)
- Connect to Solana mainnet
- Implement real payment verification
- Add custom rate limiting
- Enable webhook notifications

---

**Happy monetizing! 💰**

