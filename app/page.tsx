// app/page.tsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { CoinGeckoService } from '@/lib/api/coingecko';
import { Coin } from '@/types/crypto';
import CoinListClient from '@/components/coins/CoinListClient';

// This is a Server Component that uses SSR
export default async function HomePage() {
  let initialCoins: Coin[] = [];
  let error: string | null = null;

  try {
    // Fetch initial data on the server
    initialCoins = await CoinGeckoService.getCoins({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h',
    });
  } catch (err) {
    console.error('Failed to fetch initial coins:', err);
    error = 'Failed to load cryptocurrency data. Please try again later.';
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Cryptocurrency Portfolio Tracker
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          Track and manage your crypto investments
        </Typography>
      </Box>

      {/* Client Component for interactive features */}
      <CoinListClient 
        initialCoins={initialCoins} 
        initialError={error}
      />
    </Container>
  );
}

// Metadata for SEO
export const metadata = {
  title: 'Crypto Portfolio Tracker | Track Your Investments',
  description: 'Track and manage your cryptocurrency portfolio with real-time prices, market data, and performance analytics.',
  keywords: 'cryptocurrency, bitcoin, ethereum, portfolio, tracker, crypto, investment',
};