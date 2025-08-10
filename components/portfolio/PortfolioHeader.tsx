// components/portfolio/PortfolioHeader.tsx
'use client';

import React from 'react';
import { Box, Typography, IconButton, useTheme, alpha } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface PortfolioHeaderProps {
  onRefresh?: () => void;
}

export default function PortfolioHeader({ onRefresh }: PortfolioHeaderProps) {
  const theme = useTheme();

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontWeight: 700,
          fontSize: { xs: '1.75rem', sm: '2.125rem' }
        }}
      >
        My Portfolio
      </Typography>
      <IconButton 
        onClick={handleRefresh}
        sx={{ 
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
        }}
      >
        <Refresh />
      </IconButton>
    </Box>
  );
}