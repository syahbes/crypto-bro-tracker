// components/coins/CoinDetailPage.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Chip,
  Card,
  CardContent,
  Skeleton,
  Alert,
  IconButton,
  useTheme,
  alpha,
  Divider,
  LinearProgress,
  useMediaQuery,
  Snackbar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ArrowBack,
  Add,
  Remove,
  BookmarkBorder,
  Bookmark,
  Share,
  CheckCircle,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CoinGeckoService } from '@/lib/api/coingecko';
import { Coin } from '@/types/crypto';
import { useAppDispatch, useAppSelector, addToPortfolio, type PortfolioItem } from '@/lib/store';
import CoinDetailSkeleton from './coinDetail/CoinDetailSkeleton';

interface CoinDetailPageProps {
  coinId: string;
  initialData?: Coin | null;
}

export default function CoinDetailPage({ coinId, initialData = null }: CoinDetailPageProps) {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFavorite, setIsFavorite] = useState(false);
  const [portfolioAmount, setPortfolioAmount] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Get portfolio items to check if this coin is already in portfolio
  const portfolioItems = useAppSelector((state) => state.portfolio.items);
  const existingPortfolioItem = portfolioItems.find(item => item.id === coinId);

  const {
    data: coin,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['coin', coinId],
    queryFn: () => CoinGeckoService.getCoinById(coinId),
    initialData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });

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

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value?.toFixed(2)}%`;
  };

  const handleAddToPortfolio = () => {
    if (!coin || portfolioAmount <= 0) return;

    const portfolioItem: PortfolioItem = {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      amount: portfolioAmount,
      purchasePrice: coin.currentPrice,
      purchaseDate: new Date().toISOString(),
      currentPrice: coin.currentPrice,
    };

    dispatch(addToPortfolio(portfolioItem));
    setShowSuccessMessage(true);
    setPortfolioAmount(0); // Reset amount after adding
  };

  const handleShare = () => {
    if (navigator.share && coin) {
      navigator.share({
        title: `${coin.name} (${coin.symbol})`,
        text: `Check out ${coin.name} current price: ${formatCurrency(coin.currentPrice)}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) return <CoinDetailSkeleton />;

  if (error || !coin) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load cryptocurrency details. Please try again.
        </Alert>
      </Box>
    );
  }

  const isPositive = coin.priceChangePercentage24h >= 0;
  const priceChangeColor = isPositive ? 'success.main' : 'error.main';

  return (
    <Box sx={{
      maxWidth: 1200,
      mx: 'auto',
      p: { xs: 2, sm: 3 },
      pb: { xs: 4, sm: 3 } // Extra padding bottom on mobile
    }}>
      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessMessage(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircle />}
          sx={{ width: '100%' }}
        >
          Successfully added {portfolioAmount} {coin.symbol.toUpperCase()} to your portfolio!
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton
            onClick={() => router.back()}
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant={isSmall ? "h5" : "h4"}
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Cryptocurrency Details
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
      }}>
        {/* Left Column - Main Info */}
        <Box sx={{
          flex: 1,
          minWidth: 0, // Prevents flex item from overflowing
        }}>
          {/* Coin Header Card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: 0, flex: 1 }}>
                <Avatar
                  src={coin.image}
                  alt={coin.name}
                  sx={{
                    width: { xs: 48, sm: 64 },
                    height: { xs: 48, sm: 64 },
                    flexShrink: 0
                  }}
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant={isSmall ? "h4" : "h3"}
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
                      wordBreak: 'break-word'
                    }}
                  >
                    {coin.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography
                      variant={isSmall ? "body1" : "h6"}
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase' }}
                    >
                      {coin.symbol}
                    </Typography>
                    <Chip
                      label={`#${coin.marketCapRank}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 24 }}
                    />
                    {existingPortfolioItem && (
                      <Chip
                        label="In Portfolio"
                        size="small"
                        color="primary"
                        variant="filled"
                        sx={{ height: 24 }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box display="flex" gap={1} sx={{ flexShrink: 0 }}>
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  color={isFavorite ? 'primary' : 'default'}
                  size={isSmall ? "small" : "medium"}
                >
                  {isFavorite ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
                <IconButton
                  onClick={handleShare}
                  size={isSmall ? "small" : "medium"}
                >
                  <Share />
                </IconButton>
              </Box>
            </Box>

            {/* Price Section */}
            <Box mb={3}>
              <Typography
                variant={isSmall ? "h3" : "h2"}
                component="p"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
                  wordBreak: 'break-word'
                }}
              >
                {formatCurrency(coin.currentPrice)}
              </Typography>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={1}
                flexWrap="wrap"
              >
                {isPositive ? (
                  <TrendingUp sx={{ fontSize: { xs: 20, sm: 24 }, color: priceChangeColor }} />
                ) : (
                  <TrendingDown sx={{ fontSize: { xs: 20, sm: 24 }, color: priceChangeColor }} />
                )}
                <Typography
                  variant={isSmall ? "body1" : "h6"}
                  sx={{ color: priceChangeColor, fontWeight: 600 }}
                >
                  {formatPercentage(coin.priceChangePercentage24h)}
                </Typography>
                <Typography
                  variant={isSmall ? "body2" : "h6"}
                  color="text.secondary"
                >
                  ({isPositive ? '+' : ''}{formatCurrency(coin.priceChange24h)})
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date(coin.lastUpdated).toLocaleString()}
              </Typography>
            </Box>

            {/* 24h Range */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                24h Range
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={1}
                flexDirection={{ xs: 'column', sm: 'row' }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: { sm: 80 },
                    alignSelf: { xs: 'flex-start', sm: 'center' }
                  }}
                >
                  {formatCurrency(coin.low24h)}
                </Typography>
                <Box sx={{
                  flex: 1,
                  position: 'relative',
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <LinearProgress
                    variant="determinate"
                    value={((coin.currentPrice - coin.low24h) / (coin.high24h - coin.low24h)) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.divider, 0.2),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: `${((coin.currentPrice - coin.low24h) / (coin.high24h - coin.low24h)) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      border: '2px solid white',
                      boxShadow: theme.shadows[3],
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: { sm: 80 },
                    textAlign: { xs: 'left', sm: 'right' },
                    alignSelf: { xs: 'flex-end', sm: 'center' }
                  }}
                >
                  {formatCurrency(coin.high24h)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Market Statistics */}
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
        </Box>

        {/* Right Column - Portfolio Actions */}
        <Box sx={{
          width: { xs: '100%', lg: 400 },
          flexShrink: 0,
        }}>
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
        </Box>
      </Box>
    </Box>
  );
}

