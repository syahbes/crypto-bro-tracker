// components/coins/coinDetail/SuccessSnackbar.tsx
'use client';

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface SuccessSnackbarProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  symbol: string;
}

export default function SuccessSnackbar({ 
  open, 
  onClose, 
  amount, 
  symbol 
}: SuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        icon={<CheckCircle />}
        sx={{ width: '100%' }}
      >
        Successfully added {amount} {symbol.toUpperCase()} to your portfolio!
      </Alert>
    </Snackbar>
  );
}