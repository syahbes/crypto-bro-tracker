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
          width: 280,
          flexShrink: 0,
          height: "100%",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          position: "relative",
          "&:hover": {
            boxShadow: `0 2px 10px ${theme.palette.primary.main}`,
          },
        })}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
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
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: 600, fontSize: "1rem" }}
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
            sx={{ fontWeight: 700, mb: 1 }}
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
        </CardContent>
      </Card>
    </Link>
  );
}
