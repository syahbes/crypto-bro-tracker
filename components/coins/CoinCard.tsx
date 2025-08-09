// components/coins/CoinCard.tsx
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Skeleton,
} from '@mui/material';
import { TrendingUp, TrendingDown, Add } from '@mui/icons-material';
import { Coin } from '@/types/crypto';

interface CoinCardProps {
  coin: Coin;
  onAddToPortfolio?: (coin: Coin) => void;
  onClick?: (coin: Coin) => void;
  loading?: boolean;
}

export default function CoinCard({ coin, onAddToPortfolio, onClick, loading = false }: CoinCardProps) {
  if (loading) {
    return <CoinCardSkeleton />;
  }

  const isPositive = coin.priceChangePercentage24h >= 0;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 6 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(coin);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToPortfolio) {
      onAddToPortfolio(coin);
    }
  };

  return (
    <Card
      sx={(theme) => ({
        width: 280, // fixed width for both desktop & mobile
        flexShrink: 0, // prevents shrinking in flex layouts
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        '&:hover': onClick
          ? {
            boxShadow: `0 4px 20px ${theme.palette.mode === 'dark'
                ? 'rgba(226, 8, 255, 0.57)'
                : 'rgba(0, 0, 0, 0.2)'
              }`,
          }
          : {},
      })}
      onClick={handleCardClick}
    >

      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Header with Avatar and Add Button */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              src={coin.image}
              alt={coin.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {coin.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coin.symbol}
              </Typography>
            </Box>
          </Box>

          {onAddToPortfolio && (
            <IconButton
              onClick={handleAddClick}
              size="small"
              color="primary"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                width: 32,
                height: 32,
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Price */}
        <Typography variant="h5" component="p" sx={{ fontWeight: 700, mb: 1 }}>
          {formatCurrency(coin.currentPrice)}
        </Typography>

        {/* Price Change */}
        <Box display="flex" alignItems="center" gap={0.5} mb={2}>
          {isPositive ? (
            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
          ) : (
            <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 600,
            }}
          >
            {isPositive ? '+' : ''}{coin.priceChangePercentage24h.toFixed(2)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({isPositive ? '+' : ''}{formatCurrency(coin.priceChange24h)})
          </Typography>
        </Box>

        {/* Market Info */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Market Cap
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatMarketCap(coin.marketCap)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Rank
            </Typography>
            <Chip
              label={`#${coin.marketCapRank}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.75rem' }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              24h Volume
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatMarketCap(coin.totalVolume)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// Loading skeleton component
function CoinCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="text" width={100} height={24} />
              <Skeleton variant="text" width={50} height={20} />
            </Box>
          </Box>
          <Skeleton variant="circular" width={32} height={32} />
        </Box>

        <Skeleton variant="text" width={120} height={32} sx={{ mb: 1 }} />

        <Box display="flex" alignItems="center" gap={0.5} mb={2}>
          <Skeleton variant="text" width={80} height={20} />
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          {[...Array(3)].map((_, i) => (
            <Box key={i} display="flex" justifyContent="space-between" alignItems="center">
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="text" width={60} height={16} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}