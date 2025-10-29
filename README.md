# x402wrap

Transform any API into a paid endpoint in seconds. No code, no setup, just paste and earn.

Built with the **x402 protocol** on **Solana** for instant micropayments.

![x402wrap Demo](https://img.shields.io/badge/status-live-brightgreen) ![Solana](https://img.shields.io/badge/Solana-mainnet-blueviolet) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Instant API Monetization** - Turn any URL into a paid endpoint in 30 seconds
- **Lightning Fast** - Built on Solana for sub-second settlement
- **Micropayments** - Charge as little as $0.001 per request with x402 protocol
- **AI-Ready** - Perfect for autonomous agents and machine-to-machine payments
- **Real-Time Analytics** - Track requests, revenue, and performance live
- **No Registration** - Just paste your wallet address, no account needed
- **Zero Fees** - Direct wallet-to-wallet payments, no middleman

## Use Cases

- **API Providers**: Monetize your APIs without complex billing systems
- **Data Services**: Sell access to real-time data feeds
- **ML Models**: Charge per inference for AI model APIs
- **Content Creators**: Paywall premium content and APIs
- **Developer Tools**: Transform free APIs into revenue-generating services
- **AI Agents**: Enable autonomous payments between AI systems

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Solana wallet address (Phantom, Solflare, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/x402wrap.git
cd x402wrap

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
# Optional: Custom Solana RPC endpoint
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Database path (defaults to ./x402.db)
DATABASE_PATH=./x402.db
```

## How It Works

### For API Creators

1. **Paste Your API URL** - Enter any HTTP/HTTPS endpoint
2. **Set Your Price** - Choose price per request in USDC
3. **Add Your Wallet** - Paste your Solana wallet address
4. **Get Your Link** - Receive a shortened x402 link instantly

Example:
```
Original API:  https://api.example.com/data
x402 Link:     https://x402wrap.com/abc123
Price:         $0.01 USDC per request
```

### For API Users

1. **Make a Request** - Hit the x402 link with any HTTP method
2. **Receive 402 Payment Required** - Get payment details
3. **Send Payment** - Pay via x402 protocol on Solana
4. **Include Signature** - Add transaction signature to headers
5. **Get Response** - Request is forwarded to original API

Example request:
```bash
curl -X POST https://x402wrap.com/abc123 \
  -H "x-payment-signature: 5J7Xk9..." \
  -H "x-payment-from: 7xKXR...9Qwp" \
  -H "Content-Type: application/json" \
  -d '{"query": "data"}'
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Blockchain**: Solana Web3.js
- **Protocol**: x402 Payment Standard
- **Deployment**: Vercel (recommended)

## API Reference

### Create Link

```typescript
POST /api/create

Body:
{
  "apiUrl": "https://api.example.com/endpoint",
  "price": 0.01,
  "wallet": "7xKXR...9Qwp"
}

Response:
{
  "id": "abc123",
  "url": "https://api.example.com/endpoint",
  "price": 0.01,
  "wallet": "7xKXR...9Qwp"
}
```

### Proxy Request

```typescript
ANY /:id

Headers:
- x-payment-signature: <transaction_signature>
- x-payment-from: <payer_wallet>

Response:
- 402 Payment Required (if no payment)
- 200 OK + original API response (if paid)
```

### Get Statistics

```typescript
GET /api/stats/:id

Response:
{
  "link": {
    "id": "abc123",
    "original_url": "...",
    "price": 0.01,
    "total_requests": 150,
    "total_revenue": 1.50
  },
  "last24h": {
    "count": 50,
    "revenue": 0.50
  },
  "recentRequests": [...]
}
```

## Design Philosophy

- **Minimalist** - Clean, modern UI inspired by Vercel and Linear
- **Fast** - Optimized for speed and performance
- **Intuitive** - Zero learning curve, works like URL shorteners

## Security

- ✅ Input validation on all endpoints
- ✅ Solana wallet address verification
- ✅ Transaction signature validation
- ✅ SQL injection prevention
- ✅ Rate limiting (recommended in production)
- ✅ HTTPS only in production

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/x402wrap)

Or manually:

```bash
# Build the project
npm run build

# Deploy
vercel deploy
```

### Environment Variables in Production

```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NODE_ENV=production
```

## Roadmap

- [x] Core x402 proxy functionality
- [x] Real-time analytics dashboard
- [x] Solana payment verification
- [ ] Custom domain support
- [ ] Multi-token support (SOL, USDT)
- [ ] Advanced rate limiting
- [ ] Webhook notifications
- [ ] API key management
- [ ] Team collaboration features
- [ ] Revenue sharing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- **x402 Protocol** - Coinbase for the x402 payment standard
- **Solana** - High-performance blockchain infrastructure
- **Next.js** - Amazing React framework
- **Vercel** - Deployment and hosting platform

## Contact

Questions? Reach out:
- Twitter: [@x402wrap](https://twitter.com/x402wrap)
- Email: hello@x402wrap.com

