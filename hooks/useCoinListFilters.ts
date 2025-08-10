import { useState, useCallback, useMemo } from "react";
import { Coin } from "@/types/crypto";
import {
  SortField,
  SortOrder,
  PriceFilter,
  CoinListFilters,
} from "@/types/coinList";

const COINS_PER_PAGE = 20;

export const useCoinListFilters = (coins: Coin[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("market_cap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");

  const filters: CoinListFilters = {
    searchQuery,
    sortField,
    sortOrder,
    priceFilter,
    currentPage,
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const filteredAndSortedCoins = useMemo(() => {
    let filtered = [...coins];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priceFilter === "gainers") {
      filtered = filtered.filter((coin) => coin.priceChangePercentage24h > 0);
    } else if (priceFilter === "losers") {
      filtered = filtered.filter((coin) => coin.priceChangePercentage24h < 0);
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "market_cap":
          comparison = b.marketCap - a.marketCap;
          break;
        case "volume":
          comparison = b.totalVolume - a.totalVolume;
          break;
        case "price":
          comparison = b.currentPrice - a.currentPrice;
          break;
        case "percent_change_24h":
          comparison = b.priceChangePercentage24h - a.priceChangePercentage24h;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? -comparison : comparison;
    });

    return filtered;
  }, [coins, searchQuery, sortField, sortOrder, priceFilter]);

  const totalPages = Math.ceil(filteredAndSortedCoins.length / COINS_PER_PAGE);
  const paginatedCoins = filteredAndSortedCoins.slice(
    (currentPage - 1) * COINS_PER_PAGE,
    currentPage * COINS_PER_PAGE
  );

  return {
    filters,
    filteredAndSortedCoins,
    paginatedCoins,
    totalPages,
    handlers: {
      handleSearch,
      handleSortOrderToggle,
      setSortField,
      setPriceFilter,
      setCurrentPage,
    },
  };
};
