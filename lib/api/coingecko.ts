import { Coin, CoinGeckoMarketData, CoinListParams } from "@/types/crypto";

// lib/api/coingecko.ts
const BASE_URL = 'https://api.coingecko.com/api/v3';
  
export class CoinGeckoService {
  private static async fetchData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    return response.json();
  }

  static async getCoins(params: CoinListParams = {}): Promise<Coin[]> {
    const {
      vs_currency = 'usd',
      order = 'market_cap_desc',
      per_page = 100,
      page = 1,
      sparkline = false,
      price_change_percentage = '24h',
    } = params;

    const queryParams = new URLSearchParams({
      vs_currency,
      order,
      per_page: per_page.toString(),
      page: page.toString(),
      sparkline: sparkline.toString(),
      price_change_percentage,
    });

    const data = await this.fetchData<CoinGeckoMarketData[]>(`/coins/markets?${queryParams}`);
    
    return data.map(this.transformCoinData);
  }

  static async getCoinById(id: string): Promise<Coin | null> {
    try {
      const data = await this.fetchData<CoinGeckoMarketData[]>(`/coins/markets?ids=${id}&vs_currency=usd`);
      return data.length > 0 ? this.transformCoinData(data[0]) : null;
    } catch (error) {
      console.error('Error fetching coin by ID:', error);
      return null;
    }
  }

  static async searchCoins(query: string): Promise<Coin[]> {
    if (!query.trim()) return [];
    
    try {
      const data = await this.fetchData<CoinGeckoMarketData[]>(
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`
      );
      
      const filtered = data.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      
      return filtered.slice(0, 20).map(this.transformCoinData);
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  }

  private static transformCoinData(data: CoinGeckoMarketData): Coin {
    return {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      image: data.image,
      currentPrice: data.current_price,
      marketCap: data.market_cap,
      marketCapRank: data.market_cap_rank,
      priceChange24h: data.price_change_24h,
      priceChangePercentage24h: data.price_change_percentage_24h,
      totalVolume: data.total_volume,
      high24h: data.high_24h,
      low24h: data.low_24h,
      lastUpdated: data.last_updated,
    };
  }
}