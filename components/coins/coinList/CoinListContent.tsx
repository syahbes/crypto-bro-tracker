"use client";

import React from "react";
import {
  Box,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  Pagination,
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          flexDirection: { xs: "column", md: "row" },
          flexWrap: { xs: "nowrap", md: "wrap" },
          gap: { xs: 2, sm: 2.5, md: 3 },
          justifyContent: { xs: "stretch", md: "center" },
          // Mobile: Stack vertically with full width
          // Desktop: Wrap horizontally with centered alignment
          ...(isMobile && {
            '& > *': {
              width: '100%'
            }
          })
        }}
      >
        {paginatedCoins.map((coin) => (
          <Box
            key={coin.id}
            sx={{
              // Mobile: Full width for vertical stacking
              // Desktop: Fixed width for horizontal wrapping
              flex: {
                xs: "1 1 auto",    // Mobile: flexible
                md: "0 0 auto"     // Desktop: fixed
              },
              width: {
                xs: "100%",        // Mobile: full width
                sm: "100%",        // Tablet: full width
                md: 280            // Desktop: fixed width
              },
              maxWidth: {
                xs: "100%",
                sm: 400,           // Max width on tablet for better readability
                md: 280
              },
              mx: {
                xs: 0,
                sm: "auto",        // Center on tablet
                md: 0
              }
            }}
          >
            <CoinCard coin={coin} loading={isLoading && !coins.length} />
          </Box>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          mt: { xs: 3, md: 4 },
          px: { xs: 1, sm: 0 }  // Add padding on mobile to prevent edge touching
        }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size={isMobile ? "medium" : "large"}
            showFirstButton={!isMobile}    // Hide first/last buttons on mobile to save space
            showLastButton={!isMobile}
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: { xs: '0.875rem', md: '1rem' }
              }
            }}
          />
        </Box>
      )}
    </>
  );
}