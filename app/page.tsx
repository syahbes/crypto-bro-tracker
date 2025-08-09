// app/page.tsx
'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function HomePage() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 2,
            fontWeight: 700,
            textAlign: 'center',
            background: 'linear-gradient(90deg,rgb(52, 255, 103), #ee0979)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          SY Market
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Track real-time cryptocurrency prices, build your portfolio, and monitor your investments all in one place
        </Typography>
      </Box>


      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
}