"use client";

import React from "react";
import { Box, Grid, Paper, Skeleton } from "@mui/material";

export default function PortfolioSkeleton() {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, sm: 3 } }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[...Array(3)].map((_, i) => (
          <Grid sx={{ mb: 4 }} key={i}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ mx: "auto", mb: 1 }}
              />
              <Skeleton
                variant="text"
                width={120}
                height={20}
                sx={{ mx: "auto", mb: 1 }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={32}
                sx={{ mx: "auto" }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width={100} height={24} />
        </Box>
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
          >
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
