'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

// Mock API examples to showcase
const mockAPIs = [
  {
    name: "Weather Data API",
    description: "Real-time weather data for any location worldwide",
    price: 0.001,
    requests: "12.5K",
    category: "Weather",
    provider: "WeatherPro",
  },
  {
    name: "Stock Market Feed",
    description: "Live stock prices and market data",
    price: 0.005,
    requests: "8.2K",
    category: "Finance",
    provider: "MarketData",
  },
  {
    name: "AI Image Generation",
    description: "Generate high-quality images from text prompts",
    price: 0.02,
    requests: "25.1K",
    category: "AI/ML",
    provider: "ImageGen",
  },
  {
    name: "Crypto Price Oracle",
    description: "Real-time cryptocurrency prices and analytics",
    price: 0.002,
    requests: "18.7K",
    category: "Crypto",
    provider: "CryptoOracle",
  },
  {
    name: "Translation Service",
    description: "Translate text between 100+ languages",
    price: 0.001,
    requests: "9.3K",
    category: "Language",
    provider: "TranslateAPI",
  },
  {
    name: "Email Verification",
    description: "Verify email addresses in real-time",
    price: 0.0005,
    requests: "31.2K",
    category: "Validation",
    provider: "VerifyMail",
  },
];

const categories = ["All", "Finance", "Weather", "AI/ML", "Crypto", "Language", "Validation"];

export default function MarketplacePage() {
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [submitted, setSubmitted] = useState(false);
  const [stats, setStats] = useState({
    totalAPIs: 0,
    monthlyVolume: 230,
    developers: 0,
  });

  // Fetch marketplace stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/marketplace-stats', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching marketplace stats:', error);
      }
    };

    fetchStats();
    
    // Refresh when page becomes visible (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats();
      }
    };
    
    // Refresh when window gets focus
    const handleFocus = () => {
      fetchStats();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Refresh stats every minute to show volume increase
    const interval = setInterval(fetchStats, 60 * 1000);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setEmail('');
          setSubmitted(false);
        }, 3000);
      } else {
        alert(data.error || 'Failed to join waitlist');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  const filteredAPIs = selectedCategory === 'All' 
    ? mockAPIs 
    : mockAPIs.filter(api => api.category === selectedCategory);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
            <span className="text-purple-300 text-sm font-medium">Coming Soon</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            API Marketplace
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Discover and monetize APIs instantly. Browse thousands of ready-to-use paid endpoints powered by x402.
          </p>
          
          {/* Notify Me Form */}
          <Card className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-white">Get notified at launch</h3>
            <form onSubmit={handleNotifyMe} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitted}
              />
              <Button type="submit" disabled={submitted} className="whitespace-nowrap px-6">
                {submitted ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  'Notify Me'
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">{stats.totalAPIs}+</div>
            <div className="text-gray-400">APIs Created</div>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">${stats.monthlyVolume}+</div>
            <div className="text-gray-400">Monthly Volume</div>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{stats.developers}+</div>
            <div className="text-gray-400">Developers</div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mock API Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredAPIs.map((api, index) => (
            <Card key={index} className="relative overflow-hidden">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-transparent backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white font-bold text-lg">Coming Soon</span>
              </div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{api.name}</h3>
                  <p className="text-sm text-gray-400">{api.description}</p>
                </div>
                <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                  {api.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-green-400">${api.price}</div>
                  <div className="text-xs text-gray-500">per request</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-300">{api.requests}</div>
                  <div className="text-xs text-gray-500">requests/mo</div>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                by <span className="text-purple-400">{api.provider}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-12 text-white">Why list on x402wrap?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Instant Payments</h3>
              <p className="text-gray-400">Get paid in USDC instantly with every API call via x402 protocol</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-pink-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Reach Developers</h3>
              <p className="text-gray-400">Get discovered by thousands of developers looking for paid APIs</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Zero Setup</h3>
              <p className="text-gray-400">List your API in seconds, no integration needed</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-white">Want to list your API?</h3>
          <p className="text-gray-300 mb-6">
            Join the waitlist to be among the first API providers when we launch the marketplace.
          </p>
          <form onSubmit={handleNotifyMe} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitted}
            />
            <Button type="submit" disabled={submitted} className="whitespace-nowrap px-6 min-w-[140px]">
              {submitted ? 'Saved!' : 'Join Waitlist'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

