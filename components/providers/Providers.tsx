"use client";
import { useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import StoreProvider from "@/components/providers/StoreProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortfolioProvider } from "./PortfolioProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <AppRouterCacheProvider>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <PortfolioProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </PortfolioProvider>
        </QueryClientProvider>
      </StoreProvider>
    </AppRouterCacheProvider>
  );
}
