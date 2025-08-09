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
  isLoaded: boolean;
}

const initialState: PortfolioState = {
  items: [],
  totalValue: 0,
  totalGainLoss: 0,
  totalGainLossPercentage: 0,
  isLoaded: false,
};

// LocalStorage utilities
const PORTFOLIO_STORAGE_KEY = 'crypto_portfolio';

const saveToLocalStorage = (items: PortfolioItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving portfolio to localStorage:', error);
    }
  }
};

const loadFromLocalStorage = (): PortfolioItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading portfolio from localStorage:', error);
      return [];
    }
  }
  return [];
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addToPortfolio: (state, action: PayloadAction<PortfolioItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        // Calculate weighted average purchase price
        const totalAmount = existingItem.amount + action.payload.amount;
        const totalValue = (existingItem.amount * existingItem.purchasePrice) +
                          (action.payload.amount * action.payload.purchasePrice);
        existingItem.amount = totalAmount;
        existingItem.purchasePrice = totalValue / totalAmount;
        existingItem.purchaseDate = action.payload.purchaseDate; // Update to latest purchase date
      } else {
        state.items.push(action.payload);
      }
      saveToLocalStorage(state.items);
    },
    
    removeFromPortfolio: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveToLocalStorage(state.items);
    },
    
    updatePortfolioItem: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        if (action.payload.amount <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        } else {
          item.amount = action.payload.amount;
        }
        saveToLocalStorage(state.items);
      }
    },
    
    updateCurrentPrices: (state, action: PayloadAction<Record<string, number>>) => {
      state.items.forEach(item => {
        if (action.payload[item.id]) {
          item.currentPrice = action.payload[item.id];
        }
      });

      // Recalculate totals
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
    
    loadPortfolioFromStorage: (state) => {
      const storedItems = loadFromLocalStorage();
      state.items = storedItems;
      state.isLoaded = true;
      
      // Calculate initial totals (without current prices)
      let totalCost = 0;
      state.items.forEach(item => {
        totalCost += item.amount * item.purchasePrice;
      });
      
      state.totalValue = totalCost; // Will be updated when current prices are fetched
      state.totalGainLoss = 0;
      state.totalGainLossPercentage = 0;
    },
    
    clearPortfolio: (state) => {
      state.items = [];
      state.totalValue = 0;
      state.totalGainLoss = 0;
      state.totalGainLossPercentage = 0;
      saveToLocalStorage([]);
    },
  },
});

export const {
  addToPortfolio,
  removeFromPortfolio,
  updatePortfolioItem,
  updateCurrentPrices,
  loadPortfolioFromStorage,
  clearPortfolio,
} = portfolioSlice.actions;

// Create store factory
export const makeStore = () => {
  return configureStore({
    reducer: {
      portfolio: portfolioSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['portfolio/loadPortfolioFromStorage'],
        },
      }),
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