"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import { PieChart } from "@mui/icons-material";

interface EmptyPortfolioCardProps {
  onExploreClick: () => void;
}

export default function EmptyPortfolioCard({
  onExploreClick,
}: EmptyPortfolioCardProps) {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
        My Portfolio
      </Typography>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          textAlign: "center",
          py: 8,
        }}
      >
        <CardContent>
          <PieChart sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Your portfolio is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start building your crypto portfolio by adding some coins
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onExploreClick}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Explore Cryptocurrencies
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
