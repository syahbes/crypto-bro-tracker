"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
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
          width: {
            xs: '100%',
            sm: 320,
            md: 280
          },
          height: {
            xs: 'auto',
            md: '100%'
          },
          flexShrink: 0,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          position: "relative",
          border: `1px solid ${theme.palette.background.paper}`,
          "&:hover": {
            border: `1px solid ${theme.palette.primary.main}`,
          },
        })}
      >
        <CardContent sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          "&:last-child": { pb: { xs: 1.5, sm: 2 } } 
        }}>
          {/* Single layout that adapts responsively */}
          <Box 
            display="flex" 
            sx={{
              // Mobile: horizontal layout, Desktop: vertical layout
              flexDirection: { xs: 'row', sm: 'column' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: { xs: 2, sm: 0 }
            }}
          >
            {/* Avatar and Name Section */}
            <Box 
              display="flex" 
              alignItems="center" 
              gap={1.5}
              sx={{
                flex: { xs: '0 0 auto', sm: 'none' },
                mb: { xs: 0, sm: 2 },
                justifyContent: { xs: 'flex-start', sm: 'flex-start' }
              }}
            >
              <Avatar
                src={coin.image}
                alt={coin.name}
                sx={{ 
                  width: { xs: 32, sm: 36, md: 40 }, 
                  height: { xs: 32, sm: 36, md: 40 } 
                }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  component="h3"
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: { xs: "0.875rem", sm: "0.9rem", md: "1rem" },
                    lineHeight: { xs: 1.2, sm: 'normal' }
                  }}
                >
                  {coin.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { sm: "0.875rem" } }}
                >
                  {coin.symbol}
                </Typography>
              </Box>
            </Box>

            {/* Price Section */}
            <Box 
              sx={{
                flex: { xs: '1', sm: 'none' },
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 0, sm: 1 }
              }}
            >
              <Typography
                variant="h6"
                component="p"
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.5rem" },
                  mb: { xs: 0.5, sm: 0 }
                }}
              >
                {formatCurrency(coin.currentPrice)}
              </Typography>

              {/* Price Change */}
              <Box 
                display="flex" 
                alignItems="center" 
                gap={0.5}
                sx={{
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  mb: { xs: 0, sm: 2 }
                }}
              >
                {isPositive ? (
                  <TrendingUp sx={{ fontSize: { xs: 14, sm: 16 }, color: "success.main" }} />
                ) : (
                  <TrendingDown sx={{ fontSize: { xs: 14, sm: 16 }, color: "error.main" }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: isPositive ? "#6878E2" : "error.main",
                    fontWeight: 600,
                    fontSize: { sm: "0.875rem" }
                  }}
                >
                  {isPositive ? "+" : ""}
                  {coin.priceChangePercentage24h?.toFixed(2)}%
                </Typography>
                
                {/* Price change amount - hidden on mobile */}
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ display: { xs: 'none', sm: 'inline' } }}
                >
                  ({isPositive ? "+" : ""}
                  {formatCurrency(coin.priceChange24h)})
                </Typography>
              </Box>
            </Box>

            {/* Market Info Section */}
            <Box 
              sx={{
                flex: { xs: '0 0 auto', sm: 'none' },
                textAlign: { xs: 'right', sm: 'left' },
                width: { xs: 'auto', sm: '100%' }
              }}
            >
              {/* Mobile: Rank and Market Cap only */}
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
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

              {/* Desktop: Full market info */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', gap: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Market Cap
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatMarketCap(coin.marketCap)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
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

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    24h Volume
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatMarketCap(coin.totalVolume)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
