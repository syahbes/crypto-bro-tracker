"use client";

import React from "react";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  CircularProgress,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import SearchBar from "@/components/coins/coinList/SearchBar";
import { SortField, PriceFilter, SortOrder } from "@/types/coinList";

const sortFields = [
  { value: "market_cap", label: "Market Cap" },
  { value: "volume", label: "Volume" },
  { value: "price", label: "Price" },
  { value: "percent_change_24h", label: "24h Change" },
];

interface CoinListControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  priceFilter: PriceFilter;
  paginatedCoinsLength: number;
  filteredCoinsLength: number;
  isFetching: boolean;
  onSearch: (query: string) => void;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderToggle: () => void;
  onPriceFilterChange: (filter: PriceFilter) => void;
}

export default function CoinListControls({
  sortField,
  sortOrder,
  priceFilter,
  paginatedCoinsLength,
  filteredCoinsLength,
  isFetching,
  onSearch,
  onSortFieldChange,
  onSortOrderToggle,
  onPriceFilterChange,
}: CoinListControlsProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(8px)",
      }}
    >
      <Box display="flex" flexWrap="wrap" gap={3} alignItems="center">
        <Box sx={{ flex: "1 1 250px" }}>
          <SearchBar
            onSearch={onSearch}
            placeholder="Search coins..."
          />
        </Box>

        <Box
          sx={{
            flex: "1 1 200px",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FormControl
            fullWidth
            size="medium"
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.80rem", sm: "0.875rem" },
              },
              "& .MuiSelect-select": {
                fontSize: { xs: "0.80rem", sm: "0.875rem" },
                padding: { xs: "8px 10px", sm: "10px 14px" },
              },
              "& .MuiMenuItem-root": {
                fontSize: { xs: "0.80rem", sm: "0.875rem" },
              },
            }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortField}
              label="Sort By"
              onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            >
              {sortFields.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {field.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            onClick={onSortOrderToggle}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              borderRadius: 1,
              minWidth: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 45 },
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: 18, sm: 24 },
              },
            }}
            title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
          </IconButton>
        </Box>

        <Box sx={{ flex: "1 1 200px" }}>
          <ToggleButtonGroup
            value={priceFilter}
            exclusive
            onChange={(_, value) => value && onPriceFilterChange(value)}
            size="medium"
            fullWidth
            sx={{
              "& .MuiToggleButton-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "4px 6px", sm: "6px 8px" },
              },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: 16, sm: 18 },
              },
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="gainers" color="success">
              <TrendingUp sx={{ mr: 0.5, fontSize: { xs: 16, sm: 18 } }} />
              Gainers
            </ToggleButton>
            <ToggleButton value="losers" color="error">
              <TrendingDown sx={{ mr: 0.5, fontSize: { xs: 16, sm: 18 } }} />
              Losers
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedCoinsLength} of {filteredCoinsLength}{" "}
          cryptocurrencies
          {isFetching && (
            <Box
              component="span"
              sx={{
                ml: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <CircularProgress size={12} />
              Updating...
            </Box>
          )}
        </Typography>
      </Box>
    </Paper>
  );
}
