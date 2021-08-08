import { render } from 'preact';
import { html } from 'htm/preact';
import { selectAll } from '../helpers/select-all';
import { Selectors } from '../helpers/selectors';
import { sleep } from '../helpers/sleep';
import { waitForSelector } from '../helpers/wait-for-selector';
import type { MarketPlayer } from '../services/market-data.service';
import { marketDataService } from '../services/market-data.service';
import { priceTrendService } from '../services/price-trend.service';
import { routerService } from '../services/router.service';
import type { Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import { PriceTrend } from './price-trend.widget';
import { BettingPlayers } from './betting-players.widget';

const marketPlayerData: Map<string, MarketPlayer> = new Map();
let route: string = '';
let showBettingPlayers: boolean = false;

export async function registerPlayerRowObserver(): Promise<void> {
  await priceTrendService.init();
  showBettingPlayers = !!(await settingsService.get()).find((e: Setting) => e.id === '_')?.enabled;
  const data: MarketPlayer[] = await marketDataService.getTransfermarketPlayerData();
  prepareMarketPlayerData(data);
  routeListener(routerService.getPath());
  routerService.subscribe(routeListener);
}

function prepareMarketPlayerData(data: MarketPlayer[]) {
  data.forEach((player: MarketPlayer) => {
    const key: string = 'p' + player.id;
    marketPlayerData.set(key, player);
  });
}

function parsePlayerRow(row: HTMLDivElement): void {
  const id: string = row.getAttribute('id')!;
  const is500k: boolean = (<HTMLDivElement>row.querySelector('.price > strong')!).innerText === '€ 500.000';

  const div: HTMLDivElement = document.createElement('div');
  div.id = 'bkb-player-row';
  row.querySelector('.infoBox')!.appendChild(div);

  const marketPlayer: MarketPlayer | undefined = marketPlayerData.get(id);
  render(
    html`
    <${PriceTrend} is500k=${is500k} id=${id}></${PriceTrend}> 
    ${
      route === 'transfermarkt/kaufen' && showBettingPlayers
        ? html`<${BettingPlayers} marketPlayer=${marketPlayer}></${BettingPlayers}>`
        : ''
    }
  `,
    div
  );
}

async function routeListener(path: string) {
  route = path;
  switch (path) {
    case 'transfermarkt/verkaufen':
    case 'transfermarkt/kaufen': {
      await waitForSelector(Selectors.PLAYERROW);
      await sleep(100);
      const rows: HTMLDivElement[] = <HTMLDivElement[]>Array.from(selectAll(Selectors.PLAYERROW));
      rows.forEach(parsePlayerRow);
      break;
    }
    default:
      break;
  }
}
