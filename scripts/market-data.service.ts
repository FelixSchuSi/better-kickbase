class _MarketPlayer {
  id: string = '';
  userId: string = '';
  firstName: string = '';
  lastName: string = '';
  marketValue: number = -1;
  price: number = -1;
  offers: MarketPlayerOffer[] = [];
}
export type MarketPlayer = _MarketPlayer;
const MARKET_PLAYER_KEYS: string[] = Object.keys(new _MarketPlayer());

class _MarketPlayerOffer {
  id: string = '';
  price: number = -1;
  userName: string = '';
}
export type MarketPlayerOffer = _MarketPlayerOffer;
const MARKET_PLAYER_OFFER_KEYS: string[] = Object.keys(new _MarketPlayer());

class MarketDataService {
  private _data: MarketPlayer[] = []; // Read from JSON, items have actually more entries than listed in MarketPlayer
  private _ownPlayerData: MarketPlayer[] = []; // items only contain entries listed in MarketPlayer
  private _transfermarketPlayerData: MarketPlayer[] = []; // items only contain entries listed in MarketPlayer

  public get ownPlayerData(): MarketPlayer[] {
    return this._ownPlayerData;
  }

  public set marketData(rawData: MarketPlayer[]) {
    this._data = rawData.map((player: MarketPlayer) => {
      const result: MarketPlayer = player;
      for (const key of Object.keys(player)) {
        if (!MARKET_PLAYER_KEYS.includes(key)) {
          delete result[<keyof MarketPlayer>key];
        }
        if (key === 'offers') {
          for (const key of Object.keys(player.offers)) {
            if (!MARKET_PLAYER_OFFER_KEYS.includes(key)) {
              delete result[<keyof MarketPlayer>key];
            }
          }
        }
      }
      return result;
    });
    const id: string = this.getMyId();
    this._ownPlayerData = this._data.filter((player: MarketPlayer) => player.userId === id);
    this._transfermarketPlayerData = this._data.filter((player: MarketPlayer) => !player.userId);
  }

  private getMyId(): string {
    const innerHTML: string = document.querySelector('body > script:nth-child(4)')!.innerHTML;
    return innerHTML.match(/"id":"(\d)+/)![0]!.replace('"id":"', '');
  }
}

export const marketDataService: MarketDataService = new MarketDataService();
