// components/coins/coinDetail/PageHeader.tsx
"use client";

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function PageHeader() {
  const theme = useTheme();
  const router = useRouter();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(8px)",
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant={isSmall ? "h5" : "h4"}
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Cryptocurrency Details
        </Typography>
      </Box>
    </Box>
  );
}
