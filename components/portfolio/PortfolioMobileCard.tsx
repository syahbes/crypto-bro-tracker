"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { TrendingUp, TrendingDown, Delete, Edit } from "@mui/icons-material";
import { PortfolioItem } from "@/lib/store";

export default function PortfolioMobileCard({
  item,
  onRowClick,
  onEdit,
  onDelete,
}: {
  item: PortfolioItem;
  onRowClick: (itemId: string) => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
}) {
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

  const calculateItemGainLoss = () => {
    const currentPrice = item.currentPrice || item.purchasePrice;
    const currentValue = item.amount * currentPrice;
    const purchaseValue = item.amount * item.purchasePrice;
    const gainLoss = currentValue - purchaseValue;
    const gainLossPercentage =
      purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;

    return {
      gainLoss,
      gainLossPercentage,
      currentValue,
    };
  };

  const { gainLoss, gainLossPercentage, currentValue } =
    calculateItemGainLoss();
  const isPositive = gainLoss >= 0;
  const changeColor = isPositive ? "success.main" : "error.main";
  const currentPrice = item.currentPrice || item.purchasePrice;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(8px)",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
      onClick={() => onRowClick(item.id)}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header Row */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              src={item.image}
              alt={item.name}
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.symbol}
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                width: 28,
                height: 28,
              }}
            >
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.2) },
                width: 28,
                height: 28,
              }}
            >
              <Delete sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Content Grid */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          {/* Left Column */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Holdings
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              {item.amount?.toFixed(4)} {item.symbol}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Current Price
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatCurrency(currentPrice)}
            </Typography>
          </Box>

          {/* Right Column */}
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">
              Value
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              {formatCurrency(currentValue)}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              P&L
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              gap={0.5}
            >
              {isPositive ? (
                <TrendingUp sx={{ fontSize: 14, color: changeColor }} />
              ) : (
                <TrendingDown sx={{ fontSize: 14, color: changeColor }} />
              )}
              <Box textAlign="right">
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: changeColor,
                    fontSize: "0.875rem",
                    lineHeight: 1.2,
                  }}
                >
                  {formatCurrency(Math.abs(gainLoss))}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: changeColor, display: "block" }}
                >
                  {formatPercentage(gainLossPercentage)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
