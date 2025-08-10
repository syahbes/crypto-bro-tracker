// components/layout/drawer/MobileDrawer.tsx
"use client";

import React from "react";
import { Box, Drawer, useTheme } from "@mui/material";
import MobileDrawerPortfolioInfo from "./MobileDrawerPortfolioInfo";
import MobileDrawerNavigation from "./MobileDrawerNavigation";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  portfolioItems: number;
  totalValue: number;
  totalGainLoss: number;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  onNavigate,
  portfolioItems,
  totalValue,
  totalGainLoss,
}: MobileDrawerProps) {
  const theme = useTheme();

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 240,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ pt: 2 }}>
        <MobileDrawerPortfolioInfo
          totalValue={totalValue}
          totalGainLoss={totalGainLoss}
          isVisible={portfolioItems > 0}
        />
        <MobileDrawerNavigation onNavigate={onNavigate} />
      </Box>
    </Drawer>
  );
}
