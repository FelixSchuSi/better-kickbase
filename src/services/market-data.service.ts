import { browser } from 'webextension-polyfill-ts';
import { select } from '../helpers/select';
import { Selectors } from '../helpers/selectors';

class _Player {
  id: string = '';
  userId: string = '';
  firstName: string = '';
  lastName: string = '';
  marketValue: number = -1;
}
export type Player = _Player;

class _MarketPlayer extends _Player {
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

  public async processRawData(rawData: MarketPlayer[]) {
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

    await this.set('ownPlayerData', this._ownPlayerData);
    await this.set('transfermarketPlayerData', this._transfermarketPlayerData);
  }

  public async getOwnPlayerData(): Promise<MarketPlayer[]> {
    if (this._ownPlayerData.length > 0) {
      return this._ownPlayerData;
    }
    return await this.get('ownPlayerData');
  }

  public async getTransfermarketPlayerData(): Promise<MarketPlayer[]> {
    if (this._transfermarketPlayerData.length > 0) {
      return this._transfermarketPlayerData;
    }
    return await this.get('transfermarketPlayerData');
  }

  private async set(key: string, value: MarketPlayer[]) {
    const path: string = 'market-data/' + key;
    const cacheEntry: { [s: string]: MarketPlayer[] } = {};
    cacheEntry[path] = value;
    await browser.storage.local.set(cacheEntry);
  }

  private async get(key: string): Promise<MarketPlayer[]> {
    const path: string = 'market-data/' + key;
    const cache: { [s: string]: MarketPlayer[] } = await browser.storage.local.get(path);
    return cache[path];
  }

  private getMyId(): string {
    const innerHTML: string = select(Selectors.MY_USER_ID)!.innerHTML;
    return innerHTML.match(/"id":"(\d)+/)![0]!.replace('"id":"', '');
  }
}

export const marketDataService: MarketDataService = new MarketDataService();
