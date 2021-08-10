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

  private async getLatestPriceTrends(): Promise<PriceTrends> {
    const res: Response = await fetch(
      'https://raw.githubusercontent.com/FelixSchuSi/better-kickbase/price-trends-data/price-trends.json'
    );
    const priceTrends: PriceTrends = await res.json();
    return priceTrends;
  }

  public async init(): Promise<void> {
    const priceTrends: PriceTrends = await this.getLatestPriceTrends();

    priceTrends.players.forEach((trend: PriceTrend) => {
      this.priceTrends.set(`p${trend.kickbaseId}`, trend);
    });
  }
  public getTrend(id: string): number | undefined {
    return this.priceTrends.get(id)?.delta;
  }
}

export const priceTrendService: PriceTrendService = new PriceTrendService();
