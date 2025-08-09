// components/layout/MainLayout.tsx
'use client';

import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

// Import components
import Header from './Header';
import MobileDrawer from './drawer/MobileDrawer';
import { useThemeContext } from '@/components/ThemeProvider';
import { useAppSelector } from '@/lib/store';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggleTheme } = useThemeContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Portfolio state from Redux
  const portfolioItems = useAppSelector((state) => state.portfolio.items);
  const totalValue = useAppSelector((state) => state.portfolio.totalValue);
  const totalGainLoss = useAppSelector((state) => state.portfolio.totalGainLoss);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        onThemeToggle={toggleTheme} 
        onMenuToggle={isMobile ? handleMenuToggle : undefined} 
      />
      
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={handleMenuClose}
        onNavigate={handleNavigation}
        portfolioItems={portfolioItems.length}
        totalValue={totalValue}
        totalGainLoss={totalGainLoss}
      />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}