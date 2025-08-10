// components/portfolio/PortfolioTableRow.tsx
'use client';

import React from 'react';
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Delete,
  Edit,
} from '@mui/icons-material';

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  amount: number;
  purchasePrice: number;
  currentPrice?: number;
  purchaseDate: string;
}

interface PortfolioTableRowProps {
  item: PortfolioItem;
  onRowClick: (itemId: string) => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
}

export default function PortfolioTableRow({
  item,
  onRowClick,
  onEdit,
  onDelete,
}: PortfolioTableRowProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value?.toFixed(2)}%`;
  };

  const calculateItemGainLoss = () => {
    const currentPrice = item.currentPrice || item.purchasePrice;
    const currentValue = item.amount * currentPrice;
    const purchaseValue = item.amount * item.purchasePrice;
    const gainLoss = currentValue - purchaseValue;
    const gainLossPercentage = purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;
    
    return {
      gainLoss,
      gainLossPercentage,
      currentValue,
    };
  };

  const { gainLoss, gainLossPercentage, currentValue } = calculateItemGainLoss();
  const isPositive = gainLoss >= 0;
  const changeColor = isPositive ? 'success.main' : 'error.main';
  const currentPrice = item.currentPrice || item.purchasePrice;

  return (
    <TableRow 
      hover
      sx={{ 
        cursor: 'pointer',
        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
      }}
      onClick={() => onRowClick(item.id)}
    >
      {/* Asset */}
      <TableCell>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={item.image}
            alt={item.name}
            sx={{ width: 32, height: 32 }}
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.symbol}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Holdings */}
      {!isSmall && (
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {item.amount?.toFixed(6)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.symbol}
          </Typography>
        </TableCell>
      )}

      {/* Current Price */}
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatCurrency(currentPrice)}
        </Typography>
      </TableCell>

      {/* Purchase Price */}
      {!isMobile && (
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatCurrency(item.purchasePrice)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(item.purchaseDate).toLocaleDateString()}
          </Typography>
        </TableCell>
      )}

      {/* Value */}
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatCurrency(currentValue)}
        </Typography>
        {isSmall && (
          <Typography variant="caption" color="text.secondary">
            {item.amount?.toFixed(4)} {item.symbol}
          </Typography>
        )}
      </TableCell>

      {/* P&L */}
      <TableCell>
        <Box display="flex" alignItems="center" gap={0.5}>
          {isPositive ? (
            <TrendingUp sx={{ fontSize: 16, color: changeColor }} />
          ) : (
            <TrendingDown sx={{ fontSize: 16, color: changeColor }} />
          )}
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: changeColor,
              }}
            >
              {formatCurrency(Math.abs(gainLoss))}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: changeColor }}
            >
              {formatPercentage(gainLossPercentage)}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            sx={{ 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}