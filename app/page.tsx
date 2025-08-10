import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { CoinGeckoService } from "@/lib/api/coingecko";
import { Coin } from "@/types/crypto";
import CoinListClient from "@/components/coins/CoinListClient";

export default async function HomePage() {
  let initialCoins: Coin[] = [];
  let error: string | null = null;

  try {
    initialCoins = await CoinGeckoService.getCoins({
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 50,
      page: 1,
      sparkline: false,
      price_change_percentage: "24h",
    });
  } catch (err) {
    console.error("Failed to fetch initial coins:", err);
    error = "Failed to load cryptocurrency data. Please try again later.";
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: "linear-gradient(135deg, #34E834 0%, #00D4FF 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--font-ibm-plex-mono)",
          }}
        >
          Cryptocurrency Portfolio Tracker
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          Track your crypto portfolio, manage your investments, and get
          real-time market data.
        </Typography>
      </Box>

      {/* Client Component for interactive features */}
      <CoinListClient initialCoins={initialCoins} initialError={error} />
    </Container>
  );
}

export const metadata = {
  title: "Crypto Portfolio Tracker | Track Your Investments",
  description:
    "Track and manage your cryptocurrency portfolio with real-time prices, market data, and performance analytics.",
  keywords:
    "cryptocurrency, bitcoin, ethereum, portfolio, tracker, crypto, investment",
  authors: ["Shlomo Yahnes"],
};
