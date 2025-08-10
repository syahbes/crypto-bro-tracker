"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store";

import {
  Logo,
  MobileMenuButton,
  DesktopNavigation,
  PortfolioSummary,
  ThemeToggle,
} from "@/components/layout/header/index";

interface HeaderProps {
  onThemeToggle: () => void;
  onMenuToggle?: () => void;
}

export default function Header({ onThemeToggle, onMenuToggle }: HeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Portfolio state from Redux
  const portfolioItems = useAppSelector((state) => state.portfolio.items);
  const totalValue = useAppSelector((state) => state.portfolio.totalValue);
  const totalGainLoss = useAppSelector(
    (state) => state.portfolio.totalGainLoss
  );

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogoClick = () => {
    handleNavigation("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1, sm: 2 },
          }}
        >
          <MobileMenuButton
            onToggle={onMenuToggle || (() => {})}
            isVisible={isMobile && !!onMenuToggle}
          />

          <Logo onLogoClick={handleLogoClick} />

          {!isMobile && (
            <DesktopNavigation
              portfolioItemsCount={portfolioItems.length}
              onNavigate={handleNavigation}
            />
          )}

          <PortfolioSummary
            totalValue={totalValue}
            totalGainLoss={totalGainLoss}
            isVisible={!isMobile && portfolioItems.length > 0}
          />

          <ThemeToggle onToggle={onThemeToggle} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
