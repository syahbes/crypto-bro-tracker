"use client";

import React from "react";
import { Box } from "@mui/material";
import { Coin } from "@/types/crypto";
import { useCoinListData } from "@/hooks/useCoinListData";
import { useCoinListFilters } from "@/hooks/useCoinListFilters";
import { CoinListControls, CoinListContent, RefreshButton } from "./index";

interface CoinListClientProps {
  initialCoins: Coin[];
  initialError: string | null;
}

export default function CoinListClient({
  initialCoins,
  initialError,
}: CoinListClientProps) {
  const {
    coins,
    isLoading,
    error: queryError,
    refetch,
    isFetching,
  } = useCoinListData({
    initialCoins,
    filters: {
      searchQuery: "",
      sortField: "market_cap",
      sortOrder: "desc",
      priceFilter: "all",
      currentPage: 1,
    },
  });

  const {
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
  } = useCoinListFilters(coins);

  const error = initialError || queryError;

  return (
    <Box>
      <CoinListControls
        sortField={filters.sortField}
        sortOrder={filters.sortOrder}
        priceFilter={filters.priceFilter}
        paginatedCoinsLength={paginatedCoins.length}
        filteredCoinsLength={filteredAndSortedCoins.length}
        isFetching={isFetching}
        onSearch={handleSearch}
        onSortFieldChange={setSortField}
        onSortOrderToggle={handleSortOrderToggle}
        onPriceFilterChange={setPriceFilter}
      />

      <CoinListContent
        coins={coins}
        paginatedCoins={paginatedCoins}
        totalPages={totalPages}
        currentPage={filters.currentPage}
        isLoading={isLoading}
        error={error}
        onPageChange={setCurrentPage}
        onRetry={() => refetch()}
      />

      <RefreshButton isFetching={isFetching} onRefresh={() => refetch()} />
    </Box>
  );
}
