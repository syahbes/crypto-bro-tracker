"use client";

import React from "react";
import { IconButton, useTheme } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

interface MobileMenuButtonProps {
  onToggle: () => void;
  isVisible: boolean;
}

export default function MobileMenuButton({
  onToggle,
  isVisible,
}: MobileMenuButtonProps) {
  const theme = useTheme();

  if (!isVisible) return null;

  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="menu"
      onClick={onToggle}
      sx={{
        mr: 2,
        color: theme.palette.text.primary,
      }}
    >
      <MenuIcon />
    </IconButton>
  );
}
