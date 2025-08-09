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
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from '@mui/icons-material';

interface HeaderProps {
  onThemeToggle: () => void;
  onMenuToggle?: () => void;
}

export default function Header({ onThemeToggle, onMenuToggle }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';

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
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: '-0.025em',
                fontFamily: 'var(--font-geist-sans)',
              }}
            >
              Your App
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
              <Typography
                variant="body1"
                component="a"
                href="#home"
                sx={{
                  color: theme.palette.text.primary,
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Home
              </Typography>
              <Typography
                variant="body1"
                component="a"
                href="#about"
                sx={{
                  color: theme.palette.text.primary,
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                About
              </Typography>
              <Typography
                variant="body1"
                component="a"
                href="#contact"
                sx={{
                  color: theme.palette.text.primary,
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Contact
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