// components/coins/coinDetail/MarketStatistics.tsx
'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Coin } from '@/types/crypto';

interface MarketStatisticsProps {
  coin: Coin;
}

export default function MarketStatistics({ coin }: MarketStatisticsProps) {
  const theme = useTheme();

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12)?.toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9)?.toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6)?.toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3)?.toFixed(2)}K`;
    return `$${value?.toFixed(2)}`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(8px)',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 3,
          fontSize: { xs: '1.125rem', sm: '1.25rem' }
        }}
      >
        Market Statistics
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 3,
      }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Market Capitalization
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem' }
            }}
          >
            {formatMarketCap(coin.marketCap)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            24h Trading Volume
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem' }
            }}
          >
            {formatMarketCap(coin.totalVolume)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Market Rank
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem' }
            }}
          >
            #{coin.marketCapRank}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Volume/Market Cap
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem' }
            }}
          >
            {((coin.totalVolume / coin.marketCap) * 100)?.toFixed(2)}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}