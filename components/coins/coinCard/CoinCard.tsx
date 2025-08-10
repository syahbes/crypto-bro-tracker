"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { Coin } from "@/types/crypto";
import Link from "next/link";
import CoinCardSkeleton from "@/components/coins/coinCard/CoinCardSkeleton";

interface CoinCardProps {
  coin: Coin;
  loading?: boolean;
}

export default function CoinCard({ coin, loading = false }: CoinCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  if (loading) return <CoinCardSkeleton />;

  const isPositive = coin.priceChangePercentage24h >= 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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

  return (
    <Link href={`/coins/${coin.id}`}>
      <Card
        sx={(theme) => ({
          // Responsive width and height
          width: {
            xs: '100%',      // Full width on mobile
            sm: 320,         // Slightly wider on tablet
            md: 280          // Original width on desktop
          },
          height: {
            xs: 'auto',      // Auto height on mobile
            md: '100%'       // Full height on desktop
          },
          flexShrink: 0,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          position: "relative",
          "&:hover": {
            boxShadow: `0 2px 10px ${theme.palette.primary.main}`,
          },
        })}
      >
        <CardContent sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          "&:last-child": { pb: { xs: 1.5, sm: 2 } } 
        }}>
          {/* Mobile Layout: Horizontal */}
          {isMobile ? (
            <Box display="flex" alignItems="center" gap={2}>
              {/* Left: Avatar and Name */}
              <Box display="flex" alignItems="center" gap={1.5} flex="0 0 auto">
                <Avatar
                  src={coin.image}
                  alt={coin.name}
                  sx={{ width: 32, height: 32 }}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    component="h3"
                    sx={{ fontWeight: 600, fontSize: "0.875rem", lineHeight: 1.2 }}
                  >
                    {coin.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {coin.symbol}
                  </Typography>
                </Box>
              </Box>

              {/* Center: Price and Change */}
              <Box flex="1" textAlign="center">
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ fontWeight: 700, fontSize: "0.95rem", mb: 0.5 }}
                >
                  {formatCurrency(coin.currentPrice)}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  {isPositive ? (
                    <TrendingUp sx={{ fontSize: 14, color: "success.main" }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 14, color: "error.main" }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: isPositive ? "#6878E2" : "error.main",
                      fontWeight: 600,
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {coin.priceChangePercentage24h?.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>

              {/* Right: Rank and Market Cap */}
              <Box flex="0 0 auto" textAlign="right">
                <Chip
                  label={`#${coin.marketCapRank}`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 18, fontSize: "0.7rem", mb: 0.5 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {formatMarketCap(coin.marketCap)}
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              {/* Header with Avatar */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar
                    src={coin.image}
                    alt={coin.name}
                    sx={{ 
                      width: { sm: 36, md: 40 }, 
                      height: { sm: 36, md: 40 } 
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ 
                        fontWeight: 600, 
                        fontSize: { sm: "0.9rem", md: "1rem" }
                      }}
                    >
                      {coin.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {coin.symbol}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Price */}
              <Typography
                variant="h5"
                component="p"
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  fontSize: { sm: "1.1rem", md: "1.5rem" }
                }}
              >
                {formatCurrency(coin.currentPrice)}
              </Typography>

              {/* Price Change */}
              <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                {isPositive ? (
                  <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: "error.main" }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: isPositive ? "#6878E2" : "error.main",
                    fontWeight: 600,
                  }}
                >
                  {isPositive ? "+" : ""}
                  {coin.priceChangePercentage24h?.toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({isPositive ? "+" : ""}
                  {formatCurrency(coin.priceChange24h)})
                </Typography>
              </Box>

              {/* Market Info */}
              <Box display="flex" flexDirection="column" gap={1}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Market Cap
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatMarketCap(coin.marketCap)}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Rank
                  </Typography>
                  <Chip
                    label={`#${coin.marketCapRank}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.75rem" }}
                  />
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    24h Volume
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatMarketCap(coin.totalVolume)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}