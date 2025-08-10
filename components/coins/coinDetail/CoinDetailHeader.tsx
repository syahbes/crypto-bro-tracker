"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  alpha,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  BookmarkBorder,
  Bookmark,
  Share,
} from "@mui/icons-material";
import { Coin } from "@/types/crypto";

interface CoinDetailHeaderProps {
  coin: Coin;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  hasPortfolioItem: boolean;
}

export default function CoinDetailHeader({
  coin,
  isFavorite,
  onToggleFavorite,
  onShare,
  hasPortfolioItem,
}: CoinDetailHeaderProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 6 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value?.toFixed(2)}%`;
  };

  const isPositive = coin.priceChangePercentage24h >= 0;
  const priceChangeColor = isPositive ? "success.main" : "error.main";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.02
        )} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        backdropFilter: "blur(8px)",
      }}
    >
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        mb={3}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ minWidth: 0, flex: 1 }}
        >
          <Avatar
            src={coin.image}
            alt={coin.name}
            sx={{
              width: { xs: 48, sm: 64 },
              height: { xs: 48, sm: 64 },
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant={isSmall ? "h4" : "h3"}
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                fontSize: { xs: "1.75rem", sm: "2.125rem", md: "3rem" },
                wordBreak: "break-word",
              }}
            >
              {coin.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Typography
                variant={isSmall ? "body1" : "h6"}
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                {coin.symbol}
              </Typography>
              <Chip
                label={`#${coin.marketCapRank}`}
                size="small"
                variant="outlined"
                sx={{ height: 24 }}
              />
              {hasPortfolioItem && (
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
            onClick={onToggleFavorite}
            color={isFavorite ? "primary" : "default"}
            size={isSmall ? "small" : "medium"}
          >
            {isFavorite ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
          <IconButton onClick={onShare} size={isSmall ? "small" : "medium"}>
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
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.75rem" },
            wordBreak: "break-word",
          }}
        >
          {formatCurrency(coin.currentPrice)}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
          {isPositive ? (
            <TrendingUp
              sx={{ fontSize: { xs: 20, sm: 24 }, color: priceChangeColor }}
            />
          ) : (
            <TrendingDown
              sx={{ fontSize: { xs: 20, sm: 24 }, color: priceChangeColor }}
            />
          )}
          <Typography
            variant={isSmall ? "body1" : "h6"}
            sx={{ color: priceChangeColor, fontWeight: 600 }}
          >
            {formatPercentage(coin.priceChangePercentage24h)}
          </Typography>
          <Typography variant={isSmall ? "body2" : "h6"} color="text.secondary">
            ({isPositive ? "+" : ""}
            {formatCurrency(coin.priceChange24h)})
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
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Typography
            variant="body2"
            sx={{
              minWidth: { sm: 80 },
              alignSelf: { xs: "flex-start", sm: "center" },
            }}
          >
            {formatCurrency(coin.low24h)}
          </Typography>
          <Box
            sx={{
              flex: 1,
              position: "relative",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <LinearProgress
              variant="determinate"
              value={
                ((coin.currentPrice - coin.low24h) /
                  (coin.high24h - coin.low24h)) *
                100
              }
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.divider, 0.2),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: `${
                  ((coin.currentPrice - coin.low24h) /
                    (coin.high24h - coin.low24h)) *
                  100
                }%`,
                transform: "translate(-50%, -50%)",
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "primary.main",
                border: "2px solid white",
                boxShadow: theme.shadows[3],
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              minWidth: { sm: 80 },
              textAlign: { xs: "left", sm: "right" },
              alignSelf: { xs: "flex-end", sm: "center" },
            }}
          >
            {formatCurrency(coin.high24h)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
