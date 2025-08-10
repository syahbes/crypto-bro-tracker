"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useAppDispatch,
  useAppSelector,
  loadPortfolioFromStorage,
  updateCurrentPrices,
} from "@/lib/store";
import { CoinGeckoService } from "@/lib/api/coingecko";

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { items, isLoaded } = useAppSelector((state) => state.portfolio);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    if (!isLoaded) {
      dispatch(loadPortfolioFromStorage());
    }
  }, [dispatch, isLoaded]);

  // Get current prices for portfolio items
  const portfolioIds = items.map((item) => item.id);

  const { data: currentPrices } = useQuery({
    queryKey: ["portfolio-prices", portfolioIds],
    queryFn: async () => {
      if (portfolioIds.length === 0) return {};

      const coins = await CoinGeckoService.getCoinsByIds(portfolioIds);
      const pricesMap: Record<string, number> = {};

      coins.forEach((coin) => {
        pricesMap[coin.id] = coin.currentPrice;
      });

      return pricesMap;
    },
    enabled: portfolioIds.length > 0 && isLoaded,
    refetchInterval: 60000, // Update prices every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Update current prices in Redux when data changes
  useEffect(() => {
    if (currentPrices && Object.keys(currentPrices).length > 0) {
      dispatch(updateCurrentPrices(currentPrices));
    }
  }, [currentPrices, dispatch]);

  return <>{children}</>;
}
