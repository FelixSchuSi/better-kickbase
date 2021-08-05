import { browser } from 'webextension-polyfill-ts';

interface PriceTrends {
  date: string;
  players: PriceTrend[];
}

interface PriceTrend {
  lastName: string;
  delta: number;
  detailPageLink: string;
  kickbaseId: string;
}

class PriceTrendService {
  private priceTrends: Map<string, PriceTrend> = new Map();

  private async getFromCache(): Promise<PriceTrend[]> {
    const playerDataFromCache: PriceTrend[] = <PriceTrend[]>await browser.storage.local.get('price-trends');
    return playerDataFromCache;
  }

  private async setCache(trends: PriceTrend[]): Promise<void> {
    await browser.storage.local.set({ 'price-trends': trends });
  }

  private async getLatestPriceTrends(): Promise<PriceTrends> {
    const res: Response = await fetch(
      'https://raw.githubusercontent.com/FelixSchuSi/better-kickbase/price-trends-data/price-trends.json'
    );
    const priceTrends: PriceTrends = await res.json();
    return priceTrends;
  }

  public async init(): Promise<void> {
    // const date: string = new Date().toISOString().split('T')[0];
    // const priceTrends: PriceTrend[] = await this.getFromCache();
    // if (!(priceTrends.date === date)) {
    //   // Data is outdated
    const priceTrends: PriceTrends = await this.getLatestPriceTrends();
    // await this.setCache(priceTrends.players);
    // }

    priceTrends.players.forEach((trend: PriceTrend) => {
      this.priceTrends.set(`p${trend.kickbaseId}`, trend);
    });
    // this.isReady = Promise.resolve();
  }
  public getTrend(id: string): number | undefined {
    return this.priceTrends.get(id)?.delta;
  }
}

export const priceTrendService: PriceTrendService = new PriceTrendService();
// priceTrendService.init();
