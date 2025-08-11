import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CoinGeckoService } from "@/lib/api/coingecko";
import { Coin } from "@/types/crypto";
import { SortOption, CoinListFilters } from "@/types/coinList";

interface UseCoinListDataProps {
  initialCoins: Coin[];
  filters: CoinListFilters;
}

export const useCoinListData = ({
  initialCoins,
  filters,
}: UseCoinListDataProps) => {
  const sortBy: SortOption = useMemo(() => {
    return `${filters.sortField}_${filters.sortOrder}` as SortOption;
  }, [filters.sortField, filters.sortOrder]);

  const {
    data: coins = initialCoins,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["coins", sortBy, filters.currentPage],
    queryFn: () =>
      CoinGeckoService.getCoins({
        vs_currency: "usd",
        order: sortBy,
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      }),
    initialData: initialCoins,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  return {
    coins,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};
