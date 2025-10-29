import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402wrap - Monetize Any API Instantly",
  description: "Transform any API into a paid endpoint in seconds. No code, no setup, just paste and earn.",
  keywords: ["API", "monetization", "Solana", "x402", "micropayments", "USDC"],
  authors: [{ name: "x402wrap" }],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "x402wrap - Monetize Any API Instantly",
    description: "Transform any API into a paid endpoint in seconds",
    type: "website",
    images: [{ url: '/logo/logo.svg' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {children}
      </body>
    </html>
  );
}

