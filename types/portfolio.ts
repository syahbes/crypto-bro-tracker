// types/portfolio.ts

export interface PortfolioItem {
    id: string;
    name: string;
    symbol: string;
    image: string;
    amount: number;
    purchasePrice: number;
    currentPrice?: number;
    purchaseDate: string;
  }
  
  export interface EditDialogState {
    open: boolean;
    item: PortfolioItem | null;
    newAmount: string;
  }
  
  export interface DeleteDialogState {
    open: boolean;
    item: PortfolioItem | null;
  }