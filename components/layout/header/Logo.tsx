// components/layout/header/Logo.tsx
'use client';

import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Equalizer } from '@mui/icons-material';

interface LogoProps {
  onLogoClick: () => void;
}

export default function Logo({ onLogoClick }: LogoProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
      <Equalizer sx={{ color: theme.palette.text.primary }} />
      <Typography
        variant={isMobile ? "h6" : "h5"}
        component="div"
        onClick={onLogoClick}
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          letterSpacing: '-0.025em',
          fontFamily: 'var(--font-geist-sans)',
          cursor: 'pointer',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }}
      >
        <span style={{ color: '#34E834' }}>SY </span>
        Markets
      </Typography>
    </Box>
  );
}