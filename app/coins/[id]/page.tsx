// app/coins/[id]/page.tsx - CSR
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CoinGeckoService } from "@/lib/api/coingecko";
import CoinDetailSkeleton from "@/components/coins/coinDetail/CoinDetailSkeleton";
import CoinDetailPage from "@/components/coins/coinDetail/CoinDetailPage";

export default function CoinPage() {
  const params = useParams();
  const coinId = params.id as string;

  const {
    data: coinData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["coin", coinId],
    queryFn: () => CoinGeckoService.getCoinById(coinId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds for real-time updates
    enabled: !!coinId,
  });

  if (isLoading) {
    return <CoinDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Failed to load coin data
          </h2>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <CoinDetailPage coinId={coinId} initialData={coinData} />;
}
