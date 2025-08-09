// components/MainLayout.tsx
'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  useMediaQuery, 
  useTheme,
  Typography,
  Divider,
  alpha
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
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

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

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

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Portfolio', href: '/portfolio' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onThemeToggle={toggleTheme} onMenuToggle={isMobile ? handleMenuToggle : undefined} />
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMenuClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ pt: 2 }}>
          {/* Portfolio Info Section */}
          {portfolioItems.length > 0 && (
            <>
              <Box sx={{ 
                mx: 2,
                mb: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ mb: 1, display: 'block' }}
                >
                  Portfolio Value
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {formatCurrency(totalValue)}
                  </Typography>
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
              </Box>
              <Divider sx={{ mx: 2, mb: 1 }} />
            </>
          )}

          {/* Navigation Menu */}
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text} 
                onClick={() => handleNavigation(item.href)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
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