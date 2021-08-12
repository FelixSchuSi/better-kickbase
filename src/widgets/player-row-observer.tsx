import { render } from 'preact';
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
let showPriceTrends: boolean = false;

export async function registerPlayerRowObserver(): Promise<void> {
  await priceTrendService.init();
  const settings: Setting[] = await settingsService.get();
  showBettingPlayers = !!settings.find((e: Setting) => e.id === '_')?.enabled;
  showPriceTrends = !!settings.find((e: Setting) => e.id === 'price-trends')?.enabled;
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
  const is500k: boolean = (row.querySelector('.price > strong') as HTMLDivElement).innerText === '€ 500.000';

  const div: HTMLDivElement = document.createElement('div');
  div.classList.add('bkb-player-row');

  // On /verkaufen and /kaufen each playerrow contains a Infobox where content is rendered
  // On /kader and /scouting content is rendered within the playerrow
  const renderInInfobox: boolean = ['transfermarkt/verkaufen', 'transfermarkt/kaufen'].includes(route);
  const targetSelector: string = renderInInfobox ? '.infoBox' : '.playerRow';

  row.querySelector(targetSelector)!.appendChild(div);

  const marketPlayer: MarketPlayer | undefined = marketPlayerData.get(id);
  render(
    <>
      <PriceTrend is500k={is500k} id={id} hide={!showPriceTrends}></PriceTrend>
      {route === 'transfermarkt/kaufen' ? (
        <BettingPlayers marketPlayer={marketPlayer} hide={!showBettingPlayers}></BettingPlayers>
      ) : (
        ''
      )}
    </>,
    div
  );
}

async function routeListener(path: string) {
  route = path;
  switch (path) {
    case 'transfermarkt/verkaufen':
    case 'transfermarkt/kaufen':
    case 'transfermarkt/kader':
    case 'transfermarkt/scouting': {
      await waitForSelector(Selectors.PLAYERROW);
      await sleep(100);
      const rows: HTMLDivElement[] = Array.from(selectAll(Selectors.PLAYERROW));
      if (rows.length > 0 && !rows[0].querySelector('.bkb-player-row')) {
        // Dont render bkb-player-row twice
        rows.forEach(parsePlayerRow);
      }
      break;
    }
    default:
      break;
  }
}
