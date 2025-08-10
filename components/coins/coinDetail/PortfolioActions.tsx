// components/coins/coinDetail/PortfolioActions.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Alert,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add,
  Remove,
} from '@mui/icons-material';
import { Coin } from '@/types/crypto';
import { PortfolioItem } from '@/lib/store';

interface PortfolioActionsProps {
  coin: Coin;
  existingPortfolioItem?: PortfolioItem;
  onAddToPortfolio: (amount: number) => void;
}

export default function PortfolioActions({ 
  coin, 
  existingPortfolioItem, 
  onAddToPortfolio 
}: PortfolioActionsProps) {
  const theme = useTheme();
  const [portfolioAmount, setPortfolioAmount] = useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 6 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12)?.toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9)?.toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6)?.toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3)?.toFixed(2)}K`;
    return `$${value?.toFixed(2)}`;
  };

  const handleAddToPortfolio = () => {
    if (portfolioAmount <= 0) return;
    onAddToPortfolio(portfolioAmount);
    setPortfolioAmount(0); // Reset amount after adding
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(8px)',
        position: { lg: 'sticky' },
        top: 24,
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            fontSize: { xs: '1.125rem', sm: '1.25rem' }
          }}
        >
          Add to Portfolio
        </Typography>

        {existingPortfolioItem && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You already own {existingPortfolioItem.amount?.toFixed(6)} {coin.symbol.toUpperCase()} in your portfolio
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Amount
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              onClick={() => setPortfolioAmount(Math.max(0, portfolioAmount - 0.1))}
              disabled={portfolioAmount <= 0}
              size="small"
            >
              <Remove />
            </IconButton>
            <Box
              sx={{
                flex: 1,
                textAlign: 'center',
                py: 1,
                px: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {portfolioAmount?.toFixed(6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coin.symbol}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setPortfolioAmount(portfolioAmount + 0.1)}
              size="small"
            >
              <Add />
            </IconButton>
          </Box>
        </Box>

        {portfolioAmount > 0 && (
          <Box sx={{
            mb: 3,
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 2
          }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Value
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              {formatCurrency(portfolioAmount * coin.currentPrice)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Purchase Price: {formatCurrency(coin.currentPrice)} per {coin.symbol.toUpperCase()}
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleAddToPortfolio}
          disabled={portfolioAmount <= 0}
          startIcon={<Add />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Add to Portfolio
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 2,
            fontSize: { xs: '1.125rem', sm: '1.25rem' }
          }}
        >
          Quick Stats
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              All-Time High
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatCurrency(coin.high24h * 1.2)} {/* Mock ATH */}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              All-Time Low
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatCurrency(coin.low24h * 0.1)} {/* Mock ATL */}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Circulating Supply
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                wordBreak: 'break-word',
                textAlign: 'right'
              }}
            >
              {formatMarketCap(coin.marketCap / coin.currentPrice)} {coin.symbol}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}