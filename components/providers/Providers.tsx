'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import StoreProvider from '@/app/StoreProvider';
import { PortfolioProvider } from './PortfolioProvider';
import ThemeProvider from "@/components/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <AppRouterCacheProvider>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <PortfolioProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </PortfolioProvider>
        </QueryClientProvider>
      </StoreProvider>
    </AppRouterCacheProvider>
  );
}
