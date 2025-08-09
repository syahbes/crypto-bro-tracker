import CoinDetailPage from '@/components/coins/CoinDetailPage';
import { CoinGeckoService } from '@/lib/api/coingecko';
import { Suspense } from 'react';
import CoinDetailSkeleton from '@/components/coins/coinDetail/CoinDetailSkeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoinPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<CoinDetailSkeleton /> }>
      <CoinDetailPageWrapper coinId={id} />
    </Suspense>
  );
}

async function CoinDetailPageWrapper({ coinId }: { coinId: string }) {
  let initialData = null;
  
  try {
    initialData = await CoinGeckoService.getCoinById(coinId);
  } catch (error) {
    console.error('Failed to fetch initial coin data:', error);
  }
  
  return (
    <CoinDetailPage 
      coinId={coinId} 
      initialData={initialData} 
    />
  );
}