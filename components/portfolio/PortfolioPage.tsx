// components/portfolio/PortfolioPage.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Card,
  CardContent,
  Alert,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Skeleton,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Delete,
  Edit,
  AccountBalance,
  ShowChart,
  PieChart,
  Refresh,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch, removeFromPortfolio, updatePortfolioItem } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { items, totalValue, totalGainLoss, totalGainLossPercentage, isLoaded } = useAppSelector(
    (state) => state.portfolio
  );

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    item: any;
    newAmount: string;
  }>({
    open: false,
    item: null,
    newAmount: '',
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: any;
  }>({
    open: false,
    item: null,
  });

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

  const handleEditAmount = (item: any) => {
    setEditDialog({
      open: true,
      item,
      newAmount: item.amount.toString(),
    });
  };

  const handleConfirmEdit = () => {
    const newAmount = parseFloat(editDialog.newAmount);
    if (!isNaN(newAmount) && newAmount >= 0) {
      dispatch(updatePortfolioItem({
        id: editDialog.item.id,
        amount: newAmount,
      }));
    }
    setEditDialog({ open: false, item: null, newAmount: '' });
  };

  const handleDelete = (item: any) => {
    setDeleteDialog({ open: true, item });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.item) {
      dispatch(removeFromPortfolio(deleteDialog.item.id));
    }
    setDeleteDialog({ open: false, item: null });
  };

  const calculateItemGainLoss = (item: any) => {
    const currentPrice = item.currentPrice || item.purchasePrice;
    const currentValue = item.amount * currentPrice;
    const purchaseValue = item.amount * item.purchasePrice;
    const gainLoss = currentValue - purchaseValue;
    const gainLossPercentage = purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;
    
    return {
      gainLoss,
      gainLossPercentage,
      currentValue,
      purchaseValue,
    };
  };

  if (!isLoaded) {
    return <PortfolioSkeleton />;
  }

  if (items.length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
          My Portfolio
        </Typography>
        
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            textAlign: 'center',
            py: 8,
          }}
        >
          <CardContent>
            <PieChart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Your portfolio is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start building your crypto portfolio by adding some coins
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/')}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Explore Cryptocurrencies
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const isPositiveTotal = totalGainLoss >= 0;
  const totalChangeColor = isPositiveTotal ? 'success.main' : 'error.main';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          My Portfolio
        </Typography>
        <IconButton 
          onClick={() => window.location.reload()}
          sx={{ 
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(8px)',
          }}
        >
          <Refresh />
        </IconButton>
      </Box>

      {/* Portfolio Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(8px)',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalance sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Portfolio Value
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {formatCurrency(totalValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(8px)',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <ShowChart sx={{ fontSize: 40, color: totalChangeColor, mb: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Gain/Loss
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: totalChangeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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

        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(8px)',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <PieChart sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Holdings
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {items.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {items.length === 1 ? 'Asset' : 'Assets'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Portfolio Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(8px)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Holdings
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Asset</TableCell>
                {!isSmall && <TableCell sx={{ fontWeight: 600 }}>Holdings</TableCell>}
                <TableCell sx={{ fontWeight: 600 }}>Current Price</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Purchase Price</TableCell>}
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>P&L</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const { gainLoss, gainLossPercentage, currentValue } = calculateItemGainLoss(item);
                const isPositive = gainLoss >= 0;
                const changeColor = isPositive ? 'success.main' : 'error.main';
                const currentPrice = item.currentPrice || item.purchasePrice;

                return (
                  <TableRow 
                    key={item.id}
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                    }}
                    onClick={() => router.push(`/coins/${item.id}`)}
                  >
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

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatCurrency(currentPrice)}
                      </Typography>
                    </TableCell>

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

                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAmount(item);
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
                            handleDelete(item);
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
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Amount Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, item: null, newAmount: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Holdings</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Editing holdings for {editDialog.item?.name}
            </Typography>
            <TextField
              fullWidth
              label={`Amount (${editDialog.item?.symbol})`}
              type="number"
              value={editDialog.newAmount}
              onChange={(e) => setEditDialog(prev => ({ ...prev, newAmount: e.target.value }))}
              inputProps={{ min: 0, step: 0.000001 }}
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialog({ open: false, item: null, newAmount: '' })}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmEdit}
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, item: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Remove from Portfolio</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {deleteDialog.item?.name} from your portfolio? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, item: null })}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function PortfolioSkeleton() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[...Array(3)].map((_, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width={120} height={20} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width={100} height={32} sx={{ mx: 'auto' }} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width={100} height={24} />
        </Box>
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={16} />
            </Box>
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        ))}
      </Paper>
    </Box>
  );
}