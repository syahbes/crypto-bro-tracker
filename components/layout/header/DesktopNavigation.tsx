"use client";

import React from "react";
import { Box, Button, Badge, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import { Home, AccountBalance } from "@mui/icons-material";

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | null;
}

interface DesktopNavigationProps {
  portfolioItemsCount: number;
  onNavigate: (path: string) => void;
}

export default function DesktopNavigation({
  portfolioItemsCount,
  onNavigate,
}: DesktopNavigationProps) {
  const theme = useTheme();
  const pathname = usePathname();

  const navItems: NavigationItem[] = [
    {
      label: "Home",
      path: "/",
      icon: <Home />,
    },
    {
      label: "Portfolio",
      path: "/portfolio",
      icon: <AccountBalance />,
      badge: portfolioItemsCount > 0 ? portfolioItemsCount : null,
    },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          onClick={() => onNavigate(item.path)}
          startIcon={
            item.badge ? (
              <Badge badgeContent={item.badge} color="primary">
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: pathname === item.path ? 600 : 500,
            color: pathname === item.path ? "primary.dark" : "text.primary",
            bgcolor: "transparent",
            px: 2,
            py: 1,
            transition: "all 0.2s ease",
            "&:hover": {
              color: theme.palette.primary.dark,
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
}
