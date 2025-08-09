// lib/store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice?: number;
}

interface PortfolioState {
  items: PortfolioItem[];
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

const initialState: PortfolioState = {
  items: [],
  totalValue: 0,
  totalGainLoss: 0,
  totalGainLossPercentage: 0,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addToPortfolio: (state, action: PayloadAction<PortfolioItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const totalAmount = existingItem.amount + action.payload.amount;
        const totalValue = (existingItem.amount * existingItem.purchasePrice) +
                          (action.payload.amount * action.payload.purchasePrice);
        existingItem.amount = totalAmount;
        existingItem.purchasePrice = totalValue / totalAmount;
        existingItem.purchaseDate = action.payload.purchaseDate;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromPortfolio: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updatePortfolioItem: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.amount = action.payload.amount;
      }
    },
    updateCurrentPrices: (state, action: PayloadAction<Record<string, number>>) => {
      state.items.forEach(item => {
        if (action.payload[item.id]) {
          item.currentPrice = action.payload[item.id];
        }
      });

      let totalValue = 0;
      let totalCost = 0;

      state.items.forEach(item => {
        const currentValue = item.amount * (item.currentPrice || item.purchasePrice);
        const purchaseValue = item.amount * item.purchasePrice;
        totalValue += currentValue;
        totalCost += purchaseValue;
      });

      state.totalValue = totalValue;
      state.totalGainLoss = totalValue - totalCost;
      state.totalGainLossPercentage = totalCost > 0
        ? ((totalValue - totalCost) / totalCost) * 100
        : 0;
    },
    loadPortfolioFromStorage: (state, action: PayloadAction<PortfolioItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToPortfolio,
  removeFromPortfolio,
  updatePortfolioItem,
  updateCurrentPrices,
  loadPortfolioFromStorage,
} = portfolioSlice.actions;

// ⬅ Change: create a store per request
export const makeStore = () => {
  return configureStore({
    reducer: {
      portfolio: portfolioSlice.reducer,
    },
  });
};

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Pre-typed hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = useStore.withTypes<AppStore>();
