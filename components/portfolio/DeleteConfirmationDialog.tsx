"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
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

interface DeleteConfirmationDialogProps {
  open: boolean;
  item: PortfolioItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  item,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Remove from Portfolio</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to remove {item?.name} from your portfolio? This
          action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}
