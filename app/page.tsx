'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { isValidUrl } from '@/lib/utils';
import { isValidSolanaAddress } from '@/lib/solana';

export default function Home() {
  const [formData, setFormData] = useState({
    apiUrl: '',
    price: '',
    wallet: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.apiUrl) {
      newErrors.apiUrl = 'API URL is required';
    } else if (!isValidUrl(formData.apiUrl)) {
      newErrors.apiUrl = 'Please enter a valid URL';
    }

    const price = parseFloat(formData.price);
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (price > 1000) {
      newErrors.price = 'Price must be less than $1000';
    }

    if (!formData.wallet) {
      newErrors.wallet = 'Wallet address is required';
    } else if (!isValidSolanaAddress(formData.wallet)) {
      newErrors.wallet = 'Please enter a valid Solana wallet address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl: formData.apiUrl,
          price: parseFloat(formData.price),
          wallet: formData.wallet,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const fullLink = `${baseUrl}/${data.id}`;
        setGeneratedLink(fullLink);
      } else {
        setErrors({ submit: data.error || 'Failed to create link' });
      }
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setGeneratedLink(null);
    setFormData({ apiUrl: '', price: '', wallet: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <Badge variant="success">
            <svg className="w-2 h-2 fill-current" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="4" />
            </svg>
            Live on Solana
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Hero */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge variant="primary">No Code Required</Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Monetize Any API
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  In Seconds
                </span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Transform any API into a paid endpoint. Just paste your URL, set a price, and start earning. No signup, no code, no hassle.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-4">
              {[
                { 
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                  title: 'Instant Setup', 
                  desc: 'Live in under 30 seconds' 
                },
                { 
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                  title: 'Micropayments', 
                  desc: 'x402 protocol on Solana' 
                },
                { 
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                  title: 'AI-Ready', 
                  desc: 'Perfect for autonomous agents' 
                },
                { 
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                  title: 'Real-Time Analytics', 
                  desc: 'Track every request' 
                },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <div className="text-purple-400 mt-0.5">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">$0.00</div>
                  <div className="text-sm text-gray-400">Avg Fee</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">&lt;1s</div>
                  <div className="text-sm text-gray-400">Settlement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Form */}
          <div className="animate-slide-up">
            <Card className="shadow-2xl">
              {!generatedLink ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create Your Link</h2>
                    <p className="text-gray-400">Transform your API in 3 simple steps</p>
                  </div>

                  <Input
                    label="API Endpoint URL"
                    placeholder="https://api.example.com/endpoint"
                    value={formData.apiUrl}
                    onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                    error={errors.apiUrl}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    }
                    helperText="Any HTTP/HTTPS endpoint you want to monetize"
                  />

                  <Input
                    label="Price per Request (USDC)"
                    type="number"
                    step="0.001"
                    placeholder="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    error={errors.price}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    helperText="Recommended: $0.001 - $0.10 for micropayments"
                  />

                  <Input
                    label="Receiver Wallet (Solana)"
                    placeholder="7xKXR...9Qwp"
                    value={formData.wallet}
                    onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                    error={errors.wallet}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    }
                    helperText="Payments sent directly to your wallet"
                  />

                  {errors.submit && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                      {errors.submit}
                    </div>
                  )}

                  <Button type="submit" loading={loading} className="w-full" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Paid Link
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    No registration required • No monthly fees • Instant withdrawals
                  </p>
                </form>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Link Created</h2>
                    <p className="text-gray-400">Your API is now monetized</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10 break-all">
                    <p className="text-purple-400 font-mono text-sm">{generatedLink}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={copyToClipboard} className="flex-1" variant="secondary">
                      {copied ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button onClick={() => window.open(`/stats/${generatedLink.split('/').pop()}`, '_blank')} className="flex-1">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Stats
                    </Button>
                  </div>

                  <Button onClick={resetForm} variant="ghost" className="w-full">
                    Create Another Link
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-gray-500">|</span>
            <span>Powered by x402 Protocol on Solana</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

