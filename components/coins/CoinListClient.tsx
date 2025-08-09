// components/coins/CoinListClient.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, Alert, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton, Pagination, Fab, useTheme, alpha, IconButton } from '@mui/material';
import { TrendingUp, TrendingDown, Refresh, ArrowUpward, ArrowDownward } from '@mui/icons-material';
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

type SortField = 'market_cap' | 'volume' | 'price' | 'percent_change_24h';
type SortOrder = 'asc' | 'desc';
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

const sortFields = [
  { value: 'market_cap', label: 'Market Cap' },
  { value: 'volume', label: 'Volume' },
  { value: 'price', label: 'Price' },
  { value: 'percent_change_24h', label: '24h Change' },
];

export default function CoinListClient({ initialCoins, initialError }: CoinListClientProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('market_cap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  // Convert separate field and order to combined sortBy for API
  const sortBy: SortOption = useMemo(() => {
    return `${sortField}_${sortOrder}` as SortOption;
  }, [sortField, sortOrder]);

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

  const handleSortOrderToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

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
      let comparison = 0;
      
      switch (sortField) {
        case 'market_cap': 
          comparison = b.marketCap - a.marketCap;
          break;
        case 'volume': 
          comparison = b.totalVolume - a.totalVolume;
          break;
        case 'price': 
          comparison = b.currentPrice - a.currentPrice;
          break;
        case 'percent_change_24h': 
          comparison = b.priceChangePercentage24h - a.priceChangePercentage24h;
          break;
        default: 
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [coins, searchQuery, sortField, sortOrder, priceFilter]);

  const totalPages = Math.ceil(filteredAndSortedCoins.length / COINS_PER_PAGE);
  const paginatedCoins = filteredAndSortedCoins.slice(
    (currentPage - 1) * COINS_PER_PAGE,
    currentPage * COINS_PER_PAGE
  );

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

          {/* Sort Field and Order Controls */}
          <Box sx={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl fullWidth size="medium">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                label="Sort By"
                onChange={(e) => setSortField(e.target.value as SortField)}
              >
                {sortFields.map((field) => (
                  <MenuItem key={field.value} value={field.value}>
                    {field.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <IconButton
              onClick={handleSortOrderToggle}
              size="medium"
              sx={{
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                borderRadius: 1,
                minWidth: 48,
                height: 56, // Match the Select height
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
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
              flexWrap: 'wrap',
              flexDirection: 'row',
              gap: 3,
              justifyContent: 'center'
            }}
          >
            {paginatedCoins.map((coin) => (
              <Box
                key={coin.id}
                sx={{
                  flex: '0 0 auto',
                  width: 280
                }}
              >
                <CoinCard
                  coin={coin}
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
          <Refresh />
        )}
      </Fab>
    </Box>
  );
}