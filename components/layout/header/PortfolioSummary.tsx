// components/layout/header/PortfolioSummary.tsx
'use client';

import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface PortfolioSummaryProps {
  totalValue: number;
  totalGainLoss: number;
  isVisible: boolean;
}

export default function PortfolioSummary({ totalValue, totalGainLoss, isVisible }: PortfolioSummaryProps) {
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (!isVisible) return null;

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      mr: 2,
      p: 1.5,
      borderRadius: 2,
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
    }}>
      <Box sx={{
        display: 'flex',
        gap: 1,
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'right'
      }}>
        <Typography variant="caption" color="text.secondary">
          Portfolio Value
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {formatCurrency(totalValue)}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: totalGainLoss >= 0 ? 'success.main' : 'error.main',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}
      >
        {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
      </Typography>
    </Box>
  );
}