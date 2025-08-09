    // components/coins/CoinListClient.tsx
    'use client';

    import React, { useState, useCallback, useMemo } from 'react';
    import {
    Box,
    Grid,
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

    type SortOption = 'market_cap_desc' | 'market_cap_asc' | 'volume_desc' | 'price_desc' | 'price_asc' | 'percent_change_24h_desc' | 'percent_change_24h_asc';
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

    // Query for fetching coins
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
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // Refetch every minute
    });

    // Search functionality
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, []);

    // Filter and sort coins
    const filteredAndSortedCoins = useMemo(() => {
        let filtered = [...coins];

        // Apply search filter
        if (searchQuery.trim()) {
        filtered = filtered.filter(coin => 
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
        }

        // Apply price change filter
        if (priceFilter === 'gainers') {
        filtered = filtered.filter(coin => coin.priceChangePercentage24h > 0);
        } else if (priceFilter === 'losers') {
        filtered = filtered.filter(coin => coin.priceChangePercentage24h < 0);
        }

        // Sort coins
        filtered.sort((a, b) => {
        switch (sortBy) {
            case 'market_cap_desc':
            return b.marketCap - a.marketCap;
            case 'market_cap_asc':
            return a.marketCap - b.marketCap;
            case 'volume_desc':
            return b.totalVolume - a.totalVolume;
            case 'price_desc':
            return b.currentPrice - a.currentPrice;
            case 'price_asc':
            return a.currentPrice - b.currentPrice;
            case 'percent_change_24h_desc':
            return b.priceChangePercentage24h - a.priceChangePercentage24h;
            case 'percent_change_24h_asc':
            return a.priceChangePercentage24h - b.priceChangePercentage24h;
            default:
            return 0;
        }
        });

        return filtered;
    }, [coins, searchQuery, sortBy, priceFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedCoins.length / COINS_PER_PAGE);
    const paginatedCoins = filteredAndSortedCoins.slice(
        (currentPage - 1) * COINS_PER_PAGE,
        currentPage * COINS_PER_PAGE
    );

    const handleAddToPortfolio = (coin: Coin) => {
        // TODO: Open add to portfolio dialog
        console.log('Add to portfolio:', coin);
    };

    const handleCoinClick = (coin: Coin) => {
        // TODO: Navigate to coin detail page
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
            <Grid container spacing={3} alignItems="center">
            {/* Search Bar */}
            <Grid item xs={12} md={4}>
                <SearchBar 
                onSearch={handleSearch}
                placeholder="Search coins..."
                />
            </Grid>

            {/* Sort Dropdown */}
            <Grid item xs={12} sm={6} md={3}>
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
            </Grid>

            {/* Price Filter */}
            <Grid item xs={12} sm={6} md={3}>
                <ToggleButtonGroup
                value={priceFilter}
                exclusive
                onChange={(_, value) => value && setPriceFilter(value)}
                size="medium"
                fullWidth
                >
                <ToggleButton value="all">
                    All
                </ToggleButton>
                <ToggleButton value="gainers" color="success">
                    <TrendingUp sx={{ mr: 0.5, fontSize: 18 }} />
                    Gainers
                </ToggleButton>
                <ToggleButton value="losers" color="error">
                    <TrendingDown sx={{ mr: 0.5, fontSize: 18 }} />
                    Losers
                </ToggleButton>
                </ToggleButtonGroup>
            </Grid>

            {/* View Mode Toggle */}
            <Grid item xs={12} md={2}>
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
            </Grid>
            </Grid>

            {/* Stats */}
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

        {/* Error Display */}
        {error && (
            <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
                <button onClick={() => refetch()}>
                Retry
                </button>
            }
            >
            {typeof error === 'string' ? error : 'Failed to load cryptocurrency data'}
            </Alert>
        )}

        {/* Loading State */}
        {isLoading && !initialCoins.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
            </Box>
        )}

        {/* Empty State */}
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

        {/* Coins Grid/List */}
        {filteredAndSortedCoins.length > 0 && (
            <>
            <Grid container spacing={viewMode === 'grid' ? 3 : 2}>
                {paginatedCoins.map((coin) => (
                <Grid 
                    item 
                    xs={12} 
                    sm={viewMode === 'grid' ? 6 : 12}
                    md={viewMode === 'grid' ? 4 : 12}
                    lg={viewMode === 'grid' ? 3 : 12}
                    key={coin.id}
                >
                    <CoinCard
                    coin={coin}
                    onAddToPortfolio={handleAddToPortfolio}
                    onClick={handleCoinClick}
                    loading={isLoading && !coins.length}
                    />
                </Grid>
                ))}
            </Grid>

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

        {/* Floating Action Button for Refresh */}
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