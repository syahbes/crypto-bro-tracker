"use client";

import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Box,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  PieChart,
} from "@mui/icons-material";

interface PortfolioOverviewCardsProps {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  totalHoldings: number;
}

export default function PortfolioOverviewCards({
  totalValue,
  totalGainLoss,
  totalGainLossPercentage,
  totalHoldings,
}: PortfolioOverviewCardsProps) {
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value?.toFixed(2)}%`;
  };

  const isPositiveTotal = totalGainLoss >= 0;
  const totalChangeColor = isPositiveTotal ? "success.main" : "error.main";

  const cardStyle = {
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: "blur(8px)",
    height: "100%",
  };

  const cardContentStyle = {
    textAlign: "center" as const,
    padding: { xs: 2, sm: 3 },
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: { xs: 140, sm: 160, md: 180 },
  };

  const iconStyle = {
    fontSize: { xs: 32, sm: 36, md: 40 },
    mb: { xs: 0.5, sm: 1 },
  };

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
      {/* Total Portfolio Value */}
      <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <AccountBalance
              sx={{ ...iconStyle, color: "primary.main" }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Total Portfolio Value
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
              }}
            >
              {formatCurrency(totalValue)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Gain/Loss */}
      <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <ShowChart sx={{ ...iconStyle, color: totalChangeColor }} />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Total Gain/Loss
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 0.5, sm: 1 },
                flexWrap: "wrap",
              }}
            >
              {isPositiveTotal ? (
                <TrendingUp sx={{ fontSize: { xs: 20, sm: 24 } }} />
              ) : (
                <TrendingDown sx={{ fontSize: { xs: 20, sm: 24 } }} />
              )}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: totalChangeColor,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
                }}
              >
                {formatCurrency(Math.abs(totalGainLoss))}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ 
                color: totalChangeColor, 
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                mt: 0.5
              }}
            >
              {formatPercentage(totalGainLossPercentage)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}