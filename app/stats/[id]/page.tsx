'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Logo from '@/components/Logo';
import Card from '@/components/Card';
import Badge from '@/components/Badge';

interface LinkStats {
  link: {
    id: string;
    original_url: string;
    price: number;
    receiver_wallet: string;
    created_at: number;
    total_requests: number;
    total_revenue: number;
  };
  last24h: {
    count: number;
    revenue: number;
  };
  recentRequests: Array<{
    id: number;
    timestamp: number;
    payer_wallet: string | null;
    amount: number;
    success: number;
  }>;
}

export default function StatsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/stats/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const shortenWallet = (wallet: string) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Stats Not Found</h2>
          <p className="text-gray-400">{error || 'Unable to load statistics'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-8 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <Badge variant="info">
            <svg className="w-2 h-2 fill-current animate-pulse" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="4" />
            </svg>
            Live Analytics
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl space-y-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-gray-400 text-sm mb-2">Total Requests</div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.link.total_requests.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {stats.last24h.count} in last 24h
            </div>
          </Card>

          <Card>
            <div className="text-gray-400 text-sm mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              ${(stats.link.total_revenue || 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              ${(stats.last24h.revenue || 0).toFixed(2)} in last 24h
            </div>
          </Card>

          <Card>
            <div className="text-gray-400 text-sm mb-2">Price per Request</div>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              ${stats.link.price}
            </div>
            <div className="text-sm text-gray-500">USDC</div>
          </Card>

          <Card>
            <div className="text-gray-400 text-sm mb-2">Avg. Revenue/Day</div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              ${(((stats.link.total_revenue || 0) / Math.max(1, (Date.now() - stats.link.created_at) / (24 * 60 * 60 * 1000))).toFixed(2))}
            </div>
            <div className="text-sm text-gray-500">Estimated</div>
          </Card>
        </div>

        {/* Link Details */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6">Link Details</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Short Link</div>
              <div className="flex items-center gap-3">
                <code className="flex-1 px-4 py-2 bg-white/5 rounded-lg text-purple-400 text-sm">
                  {window.location.origin}/{stats.link.id}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${stats.link.id}`)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Original API</div>
              <code className="block px-4 py-2 bg-white/5 rounded-lg text-gray-300 text-sm break-all">
                {stats.link.original_url}
              </code>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Receiver Wallet</div>
              <code className="block px-4 py-2 bg-white/5 rounded-lg text-gray-300 text-sm break-all">
                {stats.link.receiver_wallet}
              </code>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Created</div>
              <div className="text-white">{formatDate(stats.link.created_at)}</div>
            </div>
          </div>
        </Card>

        {/* Recent Requests */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6">Recent Requests</h2>
          {stats.recentRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-400">No requests yet</p>
              <p className="text-sm text-gray-500 mt-2">Share your link to start earning</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-sm font-medium text-gray-400 pb-3">Time</th>
                    <th className="text-left text-sm font-medium text-gray-400 pb-3">Payer</th>
                    <th className="text-right text-sm font-medium text-gray-400 pb-3">Amount</th>
                    <th className="text-right text-sm font-medium text-gray-400 pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRequests.map((request, i) => (
                    <tr key={request.id} className="border-b border-white/5">
                      <td className="py-4 text-sm text-gray-300">
                        {formatDate(request.timestamp)}
                      </td>
                      <td className="py-4 text-sm text-gray-300">
                        {request.payer_wallet ? (
                          <code className="px-2 py-1 bg-white/5 rounded text-xs">
                            {shortenWallet(request.payer_wallet)}
                          </code>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-4 text-sm text-right text-green-400">
                        ${request.amount.toFixed(2)}
                      </td>
                      <td className="py-4 text-sm text-right">
                        {request.success ? (
                          <Badge variant="success" size="sm">Success</Badge>
                        ) : (
                          <Badge variant="warning" size="sm">Failed</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

