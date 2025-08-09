// components/coins/CoinListClient.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  Fab,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ViewList,
  ViewModule,
  TrendingUp,
  TrendingDown,
  FilterList,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { CoinGeckoService } from '@/lib/api/coingecko';
import { Coin } from '@/types/crypto';
import { useAppDispatch } from '@/lib/store';
import CoinCard from './CoinCard';
import SearchBar from './SearchBar';

interface CoinListClientProps {
  initialCoins: Coin[];
  initialError: string | null;
}

type SortOption =
  | 'market_cap_desc'
  | 'market_cap_asc'
  | 'volume_desc'
  | 'price_desc'
  | 'price_asc'
  | 'percent_change_24h_desc'
  | 'percent_change_24h_asc';

type ViewMode = 'grid' | 'list';

const COINS_PER_PAGE = 20;

const sortOptions = [
  { value: 'market_cap_desc', label: 'Market Cap ↓' },
  { value: 'market_cap_asc', label: 'Market Cap ↑' },
  { value: 'volume_desc', label: 'Volume ↓' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'percent_change_24h_desc', label: '24h Change ↓' },
  { value: 'percent_change_24h_asc', label: '24h Change ↑' },
];

export default function CoinListClient({ initialCoins, initialError }: CoinListClientProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap_desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  const { 
    data: coins = initialCoins, 
    isLoading, 
    error: queryError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['coins', sortBy, currentPage],
    queryFn: () => CoinGeckoService.getCoins({
      vs_currency: 'usd',
      order: sortBy,
      per_page: 100,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h',
    }),
    initialData: initialCoins,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const filteredAndSortedCoins = useMemo(() => {
    let filtered = [...coins];

    if (searchQuery.trim()) {
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priceFilter === 'gainers') {
      filtered = filtered.filter(coin => coin.priceChangePercentage24h > 0);
    } else if (priceFilter === 'losers') {
      filtered = filtered.filter(coin => coin.priceChangePercentage24h < 0);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'market_cap_desc': return b.marketCap - a.marketCap;
        case 'market_cap_asc': return a.marketCap - b.marketCap;
        case 'volume_desc': return b.totalVolume - a.totalVolume;
        case 'price_desc': return b.currentPrice - a.currentPrice;
        case 'price_asc': return a.currentPrice - b.currentPrice;
        case 'percent_change_24h_desc': return b.priceChangePercentage24h - a.priceChangePercentage24h;
        case 'percent_change_24h_asc': return a.priceChangePercentage24h - b.priceChangePercentage24h;
        default: return 0;
      }
    });

    return filtered;
  }, [coins, searchQuery, sortBy, priceFilter]);

  const totalPages = Math.ceil(filteredAndSortedCoins.length / COINS_PER_PAGE);
  const paginatedCoins = filteredAndSortedCoins.slice(
    (currentPage - 1) * COINS_PER_PAGE,
    currentPage * COINS_PER_PAGE
  );

  const handleAddToPortfolio = (coin: Coin) => {
    console.log('Add to portfolio:', coin);
  };

  const handleCoinClick = (coin: Coin) => {
    console.log('Coin clicked:', coin);
  };

  const error = initialError || queryError;

  return (
    <Box>
      {/* Controls */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box display="flex" flexWrap="wrap" gap={3} alignItems="center">
          <Box sx={{ flex: '1 1 250px' }}>
            <SearchBar onSearch={handleSearch} placeholder="Search coins..." />
          </Box>

          <Box sx={{ flex: '1 1 200px' }}>
            <FormControl fullWidth size="medium">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: '1 1 200px' }}>
            <ToggleButtonGroup
              value={priceFilter}
              exclusive
              onChange={(_, value) => value && setPriceFilter(value)}
              size="medium"
              fullWidth
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="gainers" color="success">
                <TrendingUp sx={{ mr: 0.5, fontSize: 18 }} />
                Gainers
              </ToggleButton>
              <ToggleButton value="losers" color="error">
                <TrendingDown sx={{ mr: 0.5, fontSize: 18 }} />
                Losers
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ flex: '1 1 150px' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value)}
              size="medium"
              fullWidth
            >
              <ToggleButton value="grid">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedCoins.length} of {filteredAndSortedCoins.length} cryptocurrencies
            {isFetching && (
              <Box component="span" sx={{ ml: 2, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <CircularProgress size={12} />
                Updating...
              </Box>
            )}
          </Typography>
        </Box>
      </Paper>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={<button onClick={() => refetch()}>Retry</button>}
        >
          {typeof error === 'string' ? error : 'Failed to load cryptocurrency data'}
        </Alert>
      )}

      {/* Loading */}
      {isLoading && !initialCoins.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Empty */}
      {!isLoading && filteredAndSortedCoins.length === 0 && !error && (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No cryptocurrencies found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Paper>
      )}

      {/* Coins flex layout */}
      {filteredAndSortedCoins.length > 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexWrap: viewMode === 'grid' ? 'wrap' : 'nowrap',
              flexDirection: viewMode === 'list' ? 'column' : 'row',
              gap: 3,
              justifyContent: viewMode === 'grid' ? 'center' : 'flex-start',
            }}
          >
            {paginatedCoins.map((coin) => (
              <Box
                key={coin.id}
                sx={{
                  flex: viewMode === 'grid' ? '0 0 auto' : '1 1 100%',
                  width: viewMode === 'grid' ? 280 : '100%',
                }}
              >
                <CoinCard
                  coin={coin}
                  onAddToPortfolio={handleAddToPortfolio}
                  onClick={handleCoinClick}
                  loading={isLoading && !coins.length}
                />
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          opacity: isFetching ? 0.5 : 1,
        }}
        onClick={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <FilterList />
        )}
      </Fab>
    </Box>
  );
}
