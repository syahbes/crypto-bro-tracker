'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Container,
  Badge,
  Button,
  alpha,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  AccountBalance,
  Home,
  TrendingUp,
  Equalizer,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/store';

interface HeaderProps {
  onThemeToggle: () => void;
  onMenuToggle?: () => void;
}

export default function Header({ onThemeToggle, onMenuToggle }: HeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';

  // Portfolio state from Redux
  const portfolioItems = useAppSelector((state) => state.portfolio.items);
  const totalValue = useAppSelector((state) => state.portfolio.totalValue);
  const totalGainLoss = useAppSelector((state) => state.portfolio.totalGainLoss);

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: <Home />,
    },
    {
      label: 'Portfolio',
      path: '/portfolio',
      icon: <AccountBalance />,
      badge: portfolioItems.length > 0 ? portfolioItems.length : null,
    },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Mobile Menu Button */}
          {isMobile && onMenuToggle && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onMenuToggle}
              sx={{
                mr: 2,
                color: theme.palette.text.primary,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {/* icon of graph */}
            <Equalizer sx={{ color: theme.palette.text.primary }} />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              onClick={() => handleNavigation('/')}
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
              Market
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  startIcon={
                    item.badge ? (
                      <Badge badgeContent={item.badge} color="primary">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: pathname === item.path ? 600 : 500,
                    color: pathname === item.path ? 'primary.main' : 'text.primary',
                    bgcolor: pathname === item.path ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                    px: 2,
                    py: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: alpha(theme.palette.primary.main, 0.8),
                      bgcolor: pathname === item.path
                        ? theme.palette.background.paper
                        : theme.palette.background.default,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Desktop Portfolio Summary */}
          {!isMobile && portfolioItems.length > 0 && (
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
          )}

          {/* Theme Toggle Button */}
          <IconButton
            onClick={onThemeToggle}
            color="inherit"
            aria-label="toggle theme"
            sx={{
              color: theme.palette.text.primary,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                transform: 'scale(1.05)',
              },
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}