// components/coins/coinDetail/CoinDetailPage.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Alert,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { CoinGeckoService } from '@/lib/api/coingecko';
import { Coin } from '@/types/crypto';
import { useAppDispatch, useAppSelector, addToPortfolio, type PortfolioItem } from '@/lib/store';
import CoinDetailSkeleton from './CoinDetailSkeleton';
import PageHeader from '@/components/coins/coinDetail/PageHeader';
import CoinDetailHeader from '@/components/coins/coinDetail/CoinDetailHeader';
import MarketStatistics from '@/components/coins/coinDetail/MarketStatistics';
import PortfolioActions from '@/components/coins/coinDetail/PortfolioActions';
import SuccessSnackbar from '@/components/coins/coinDetail/SuccessSnackbar';

interface CoinDetailPageProps {
  coinId: string;
  initialData?: Coin | null;
}

export default function CoinDetailPage({ coinId, initialData = null }: CoinDetailPageProps) {
  const dispatch = useAppDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [addedAmount, setAddedAmount] = useState(0);

  // Get portfolio items to check if this coin is already in portfolio
  const portfolioItems = useAppSelector((state) => state.portfolio.items);
  const existingPortfolioItem = portfolioItems.find(item => item.id === coinId);

  const {
    data: coin,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['coin', coinId],
    queryFn: () => CoinGeckoService.getCoinById(coinId),
    initialData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });

  const handleAddToPortfolio = (amount: number) => {
    if (!coin || amount <= 0) return;

    const portfolioItem: PortfolioItem = {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      amount: amount,
      purchasePrice: coin.currentPrice,
      purchaseDate: new Date().toISOString(),
      currentPrice: coin.currentPrice,
    };

    dispatch(addToPortfolio(portfolioItem));
    setAddedAmount(amount);
    setShowSuccessMessage(true);
  };

  const handleShare = () => {
    if (navigator.share && coin) {
      navigator.share({
        title: `${coin.name} (${coin.symbol})`,
        text: `Check out ${coin.name} current price: ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: coin.currentPrice < 1 ? 6 : 2,
          maximumFractionDigits: coin.currentPrice < 1 ? 6 : 2,
        }).format(coin.currentPrice)}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) return <CoinDetailSkeleton />;

  if (error || !coin) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load cryptocurrency details. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: 1200,
      mx: 'auto',
      p: { xs: 2, sm: 3 },
      pb: { xs: 4, sm: 3 } // Extra padding bottom on mobile
    }}>
      {/* Success Snackbar */}
      <SuccessSnackbar
        open={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        amount={addedAmount}
        symbol={coin.symbol}
      />

      {/* Page Header */}
      <PageHeader />

      {/* Main Content */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
      }}>
        {/* Left Column - Main Info */}
        <Box sx={{
          flex: 1,
          minWidth: 0, // Prevents flex item from overflowing
        }}>
          {/* Coin Header */}
          <CoinDetailHeader
            coin={coin}
            isFavorite={isFavorite}
            onToggleFavorite={() => setIsFavorite(!isFavorite)}
            onShare={handleShare}
            hasPortfolioItem={!!existingPortfolioItem}
          />

          {/* Market Statistics */}
          <MarketStatistics coin={coin} />
        </Box>

        {/* Right Column - Portfolio Actions */}
        <Box sx={{
          width: { xs: '100%', lg: 400 },
          flexShrink: 0,
        }}>
          <PortfolioActions
            coin={coin}
            existingPortfolioItem={existingPortfolioItem}
            onAddToPortfolio={handleAddToPortfolio}
          />
        </Box>
      </Box>
    </Box>
  );
}