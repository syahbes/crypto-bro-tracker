// components/portfolio/PortfolioPage.tsx
'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useAppSelector, useAppDispatch, removeFromPortfolio, updatePortfolioItem } from '@/lib/store';
import { useRouter } from 'next/navigation';

// Import the new components
import PortfolioHeader from './PortfolioHeader';
import PortfolioOverviewCards from './PortfolioOverviewCards';
import PortfolioTable from './PortfolioTable';
import EmptyPortfolioCard from './EmptyPortfolioCard';
import EditAmountDialog from './EditAmountDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import PortfolioSkeleton from './PortfolioSkeleton';

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

export default function PortfolioPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { items, totalValue, totalGainLoss, totalGainLossPercentage, isLoaded } = useAppSelector(
    (state) => state.portfolio
  );

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    item: PortfolioItem | null;
    newAmount: string;
  }>({
    open: false,
    item: null,
    newAmount: '',
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: PortfolioItem | null;
  }>({
    open: false,
    item: null,
  });

  const handleEditAmount = (item: PortfolioItem) => {
    setEditDialog({
      open: true,
      item,
      newAmount: item.amount.toString(),
    });
  };

  const handleEditAmountChange = (newAmount: string) => {
    setEditDialog(prev => ({ ...prev, newAmount }));
  };

  const handleConfirmEdit = () => {
    const newAmount = parseFloat(editDialog.newAmount);
    if (!isNaN(newAmount) && newAmount >= 0 && editDialog.item) {
      dispatch(updatePortfolioItem({
        id: editDialog.item.id,
        amount: newAmount,
      }));
    }
    setEditDialog({ open: false, item: null, newAmount: '' });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, item: null, newAmount: '' });
  };

  const handleDelete = (item: PortfolioItem) => {
    setDeleteDialog({ open: true, item });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.item) {
      dispatch(removeFromPortfolio(deleteDialog.item.id));
    }
    setDeleteDialog({ open: false, item: null });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const handleRowClick = (itemId: string) => {
    router.push(`/coins/${itemId}`);
  };

  const handleExploreClick = () => {
    router.push('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!isLoaded) {
    return <PortfolioSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyPortfolioCard onExploreClick={handleExploreClick} />;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <PortfolioHeader onRefresh={handleRefresh} />
      
      <PortfolioOverviewCards
        totalValue={totalValue}
        totalGainLoss={totalGainLoss}
        totalGainLossPercentage={totalGainLossPercentage}
        totalHoldings={items.length}
      />

      <PortfolioTable
        items={items}
        onRowClick={handleRowClick}
        onEdit={handleEditAmount}
        onDelete={handleDelete}
      />

      <EditAmountDialog
        open={editDialog.open}
        item={editDialog.item}
        newAmount={editDialog.newAmount}
        onClose={handleCloseEditDialog}
        onAmountChange={handleEditAmountChange}
        onConfirm={handleConfirmEdit}
      />

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        item={deleteDialog.item}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}