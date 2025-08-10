"use client";

import React from "react";
import { Box, Typography, Divider, alpha, useTheme } from "@mui/material";

interface MobileDrawerPortfolioInfoProps {
  totalValue: number;
  totalGainLoss: number;
  isVisible: boolean;
}

export default function MobileDrawerPortfolioInfo({
  totalValue,
  totalGainLoss,
  isVisible,
}: MobileDrawerPortfolioInfoProps) {
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (!isVisible) return null;

  return (
    <>
      <Box
        sx={{
          mx: 2,
          mb: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          Portfolio Value
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {formatCurrency(totalValue)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: totalGainLoss >= 0 ? "success.main" : "error.main",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {totalGainLoss >= 0 ? "+" : ""}
            {formatCurrency(totalGainLoss)}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mx: 2, mb: 1 }} />
    </>
  );
}
