"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

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

interface EditAmountDialogProps {
  open: boolean;
  item: PortfolioItem | null;
  newAmount: string;
  onClose: () => void;
  onAmountChange: (amount: string) => void;
  onConfirm: () => void;
}

export default function EditAmountDialog({
  open,
  item,
  newAmount,
  onClose,
  onAmountChange,
  onConfirm,
}: EditAmountDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Holdings</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Editing holdings for {item?.name}
          </Typography>
          <TextField
            fullWidth
            label={`Amount (${item?.symbol})`}
            type="number"
            value={newAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 0.000001,
              },
            }}
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
