"use client";

import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
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
  };

  const cardContentStyle = {
    textAlign: "center" as const,
    minHeight: 180,
    minWidth: 180,
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Total Portfolio Value */}
      <Grid sx={{ mb: 4 }}>
        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <AccountBalance
              sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Portfolio Value
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(totalValue)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Gain/Loss */}
      <Grid sx={{ mb: 4 }}>
        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <ShowChart sx={{ fontSize: 40, color: totalChangeColor, mb: 1 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Gain/Loss
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: totalChangeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {isPositiveTotal ? <TrendingUp /> : <TrendingDown />}
              {formatCurrency(Math.abs(totalGainLoss))}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: totalChangeColor, fontWeight: 600 }}
            >
              {formatPercentage(totalGainLossPercentage)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Holdings */}
      <Grid sx={{ mb: 4 }}>
        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <PieChart sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Holdings
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totalHoldings}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalHoldings === 1 ? "Asset" : "Assets"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
