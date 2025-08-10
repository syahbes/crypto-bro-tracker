"use client";

import React from "react";
import {
  Box,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  Pagination,
} from "@mui/material";
import { Coin } from "@/types/crypto";
import CoinCard from "@/components/coins/coinCard/CoinCard";

interface CoinListContentProps {
  coins: Coin[];
  paginatedCoins: Coin[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | Error | null;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export default function CoinListContent({
  coins,
  paginatedCoins,
  totalPages,
  currentPage,
  isLoading,
  error,
  onPageChange,
  onRetry,
}: CoinListContentProps) {
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ mb: 3 }}
        action={<button onClick={onRetry}>Retry</button>}
      >
        {typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : "Failed to load cryptocurrency data"}
      </Alert>
    );
  }

  if (isLoading && !coins.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!isLoading && paginatedCoins.length === 0 && !error) {
    return (
      <Paper sx={{ p: 8, textAlign: "center", borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No cryptocurrencies found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filter criteria
        </Typography>
      </Paper>
    );
  }

  if (paginatedCoins.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {paginatedCoins.map((coin) => (
          <Box
            key={coin.id}
            sx={{
              flex: "0 0 auto",
              width: 280,
            }}
          >
            <CoinCard coin={coin} loading={isLoading && !coins.length} />
          </Box>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
}
