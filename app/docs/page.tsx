'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

export default function DocsPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <Link href="/">
            <Button variant="secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-16">
          <Badge variant="primary">Developer Documentation</Badge>
          <h1 className="text-5xl font-bold mb-6 mt-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to monetize and consume paid APIs with x402wrap
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Quick Start</h2>
          <p className="text-gray-300 mb-6">
            x402wrap lets you monetize any API endpoint in seconds using the x402 protocol on Solana.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Create Your Paid Link</h3>
                <p className="text-gray-400">Go to the home page, enter your API URL, set a price, and provide your Solana wallet address</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Share Your Link</h3>
                <p className="text-gray-400">Copy the generated x402wrap.com link and share it with your users</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Get Paid Instantly</h3>
                <p className="text-gray-400">Every request to your wrapped API triggers an instant USDC payment to your wallet</p>
              </div>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-300 mb-4">
            x402wrap acts as a payment gateway for your APIs. Here&apos;s what happens when someone calls your wrapped endpoint:
          </p>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10 mb-4 font-mono text-sm overflow-x-auto">
            <div className="text-gray-400 mb-2">1. Client sends request with payment headers</div>
            <div className="text-purple-400 ml-4">↓</div>
            <div className="text-gray-400 mb-2">2. x402wrap verifies the Solana payment</div>
            <div className="text-purple-400 ml-4">↓</div>
            <div className="text-gray-400 mb-2">3. If valid, forwards request to your API</div>
            <div className="text-purple-400 ml-4">↓</div>
            <div className="text-gray-400">4. Returns your API&apos;s response to the client</div>
          </div>
          
          <p className="text-gray-400">
            All payments are instant, cryptographically verified, and sent directly to your wallet with zero intermediaries.
          </p>
        </Card>

        {/* API Provider Guide */}
        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">For API Providers</h2>
          
          <h3 className="text-xl font-semibold text-white mb-3 mt-6">Creating a Paid Endpoint</h3>
          <p className="text-gray-300 mb-4">
            Simply wrap your existing API endpoint with x402wrap:
          </p>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10 mb-4">
            <div className="text-gray-500 text-xs mb-2">Original API:</div>
            <code className="text-green-400">https://api.yoursite.com/data</code>
            
            <div className="text-gray-500 text-xs mb-2 mt-4">Wrapped API:</div>
            <code className="text-purple-400">https://x402wrap.com/abc123xyz</code>
          </div>

          <h3 className="text-xl font-semibold text-white mb-3 mt-6">Pricing Strategy</h3>
          <p className="text-gray-300 mb-4">
            Recommended pricing for different use cases:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400 mb-2">$0.001</div>
              <div className="text-sm text-gray-400">Simple data queries</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-yellow-400 mb-2">$0.01</div>
              <div className="text-sm text-gray-400">Real-time data feeds</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-orange-400 mb-2">$0.05+</div>
              <div className="text-sm text-gray-400">AI/ML computations</div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-3 mt-6">Analytics Dashboard</h3>
          <p className="text-gray-300 mb-4">
            Track your earnings in real-time at:
          </p>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
            <code className="text-purple-400">https://x402wrap.com/stats/YOUR_LINK_ID</code>
          </div>
        </Card>

        {/* API Consumer Guide */}
        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">For API Consumers</h2>
          
          <h3 className="text-xl font-semibold text-white mb-3 mt-6">Making Paid Requests</h3>
          <p className="text-gray-300 mb-4">
            To call a paid API, include payment proof in your request headers:
          </p>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto mb-4">
            <pre className="text-sm">
<span className="text-purple-400">{`// Using fetch()`}</span>
<span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> <span className="text-yellow-400">fetch</span>(<span className="text-green-400">{`'https://x402wrap.com/abc123xyz'`}</span>, {'{'}
  <span className="text-cyan-400">method</span>: <span className="text-green-400">{`'GET'`}</span>,
  <span className="text-cyan-400">headers</span>: {'{'}
    <span className="text-green-400">{`'x-payment-signature'`}</span>: paymentSignature,
    <span className="text-green-400">{`'x-payment-from'`}</span>: yourWalletAddress,
  {'}'}
{'}'});
            </pre>
          </div>

          <h3 className="text-xl font-semibold text-white mb-3 mt-6">Payment Flow</h3>
          <div className="space-y-3 mb-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="font-semibold text-white mb-2">Step 1: Create Solana Transaction</div>
              <p className="text-gray-400 text-sm">Send USDC to the API provider&apos;s wallet address</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="font-semibold text-white mb-2">Step 2: Get Transaction Signature</div>
              <p className="text-gray-400 text-sm">Wait for transaction confirmation on Solana</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="font-semibold text-white mb-2">Step 3: Make API Request</div>
              <p className="text-gray-400 text-sm">Include signature in headers when calling the wrapped API</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-3 mt-6">Error Responses</h3>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
            <pre className="text-sm">
<span className="text-gray-500">{`// 402 Payment Required`}</span>
{'{'}
  <span className="text-cyan-400">&quot;error&quot;</span>: <span className="text-green-400">&quot;Payment Required&quot;</span>,
  <span className="text-cyan-400">&quot;payment&quot;</span>: {'{'}
    <span className="text-cyan-400">&quot;recipient&quot;</span>: <span className="text-green-400">&quot;7xKXtaoaYJ...xyz&quot;</span>,
    <span className="text-cyan-400">&quot;amount&quot;</span>: <span className="text-yellow-400">0.01</span>,
    <span className="text-cyan-400">&quot;currency&quot;</span>: <span className="text-green-400">&quot;USDC&quot;</span>
  {'}'}
{'}'}
            </pre>
          </div>
        </Card>

        {/* Protocol Reference */}
        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">HTTP Headers Reference</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="py-3 text-white font-semibold">Header</th>
                  <th className="py-3 text-white font-semibold">Required</th>
                  <th className="py-3 text-white font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3"><code className="text-purple-400">x-payment-signature</code></td>
                  <td className="py-3"><Badge variant="success">Yes</Badge></td>
                  <td className="py-3">Solana transaction signature proving payment</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3"><code className="text-purple-400">x-payment-from</code></td>
                  <td className="py-3"><Badge variant="success">Yes</Badge></td>
                  <td className="py-3">Payer&apos;s Solana wallet address</td>
                </tr>
                <tr>
                  <td className="py-3"><code className="text-purple-400">x-forwarded-by</code></td>
                  <td className="py-3"><Badge variant="info">No</Badge></td>
                  <td className="py-3">Set to &quot;x402wrap&quot; (informational)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Use Cases */}
        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Use Cases</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">AI Agent Payments</h3>
              <p className="text-gray-400 text-sm">Autonomous AI agents can pay for APIs without credit cards</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Data Monetization</h3>
              <p className="text-gray-400 text-sm">Sell access to your datasets on a per-query basis</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">AI Services</h3>
              <p className="text-gray-400 text-sm">Monetize image generation, text processing, or embeddings</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Web3 Oracles</h3>
              <p className="text-gray-400 text-sm">Provide paid blockchain data feeds and price oracles</p>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">FAQ</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">What is the x402 protocol?</h3>
              <p className="text-gray-400">x402 is an open-source payment protocol by Coinbase that enables instant micropayments in USDC via HTTP. It uses the 402 Payment Required status code.</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">Do I need to integrate anything?</h3>
              <p className="text-gray-400">No! Just paste your API URL, set a price, and share the generated link. x402wrap handles all payment verification.</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">What fees does x402wrap charge?</h3>
              <p className="text-gray-400">Zero platform fees. You receive 100% of payments directly in your wallet. Only Solana network fees apply (~$0.00001).</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">Can I update my API&apos;s price?</h3>
              <p className="text-gray-400">Currently, you need to create a new link to change pricing. Dynamic pricing is coming in a future update.</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">Is this suitable for high-volume APIs?</h3>
              <p className="text-gray-400">Yes! Solana handles 65,000+ TPS with sub-second finality, making it perfect for high-frequency API calls.</p>
            </div>
          </div>
        </Card>

        {/* Support */}
        <Card className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-gray-300 mb-6">
            Join our community or reach out to our team
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord
            </Button>
            <Button>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

