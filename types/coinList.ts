export type SortField =
  | "market_cap"
  | "volume"
  | "price"
  | "percent_change_24h";
export type SortOrder = "asc" | "desc";
export type SortOption =
  | "market_cap_desc"
  | "market_cap_asc"
  | "volume_desc"
  | "price_desc"
  | "price_asc"
  | "percent_change_24h_desc"
  | "percent_change_24h_asc";

export type ViewMode = "grid" | "list";
export type PriceFilter = "all" | "gainers" | "losers";

export interface CoinListFilters {
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  priceFilter: PriceFilter;
  currentPage: number;
}
