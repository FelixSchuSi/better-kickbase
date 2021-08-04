import type { TemplateResult } from 'lit';
import { render } from 'lit';
import { html } from 'lit';
import { selectAll } from './helpers/select-all';
import { Selectors } from './helpers/selectors';
import { sleep } from './helpers/sleep';
import { waitForSelector } from './helpers/wait-for-selector';
import type { MarketPlayer, MarketPlayerOffer } from './market-data.service';
import { marketDataService } from './market-data.service';
import { priceTrendService } from './price-trend.service';
import { routerService } from './router.service';

const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0
});
const marketPlayerData: Map<string, MarketPlayer> = new Map();

export async function registerPriceTrendsObserver(): Promise<void> {
  await priceTrendService.init();
  const data: MarketPlayer[] = await marketDataService.getTransfermarketPlayerData();
  prepareMarketPlayerDate(data);
  routeListener(routerService.getPath());
  routerService.subscribe(routeListener);
}

function prepareMarketPlayerDate(data: MarketPlayer[]) {
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
  const bettingPlayers: TemplateResult = getBettingPlayersTemplate(marketPlayer);
  const priceTrend: TemplateResult = getPriceTrendTemplate(id, is500k);

  render(html`${priceTrend} ${bettingPlayers}`, div);
}

async function routeListener(path: string) {
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

function getBettingPlayersTemplate(p: MarketPlayer | undefined) {
  let length: string = '?';
  if (p && !p.offers) length = '0';
  if (p?.offers) length = String(p.offers.length);

  return html`
    <div class="bkb-betting-players">
      <div class="bkb-betting-players-popover ${length === '?' || length === '0' ? 'bkb-no-popup' : ''}">
        ${p?.offers?.map(
          (o: MarketPlayerOffer) => html` <div class="bkb-betting-players-popover-item">${o.userName}</div> `
        )}
      </div>
      <div class="bkb-betting-players-number">
        <div>${length}</div>
        <div class="material-icons bkb-betting-players-icon">people</div>
      </div>
    </div>
  `;
}

function getPriceTrendTemplate(id: string, is500k: boolean) {
  const delta: number | undefined = priceTrendService.getTrend(id);
  let deltaString: string = currencyFormatter.format(delta ?? 0);
  let trend: string = 'neutral';

  if (delta && delta > 0) {
    trend = 'positive';
    deltaString = `+${deltaString}`;
  } else if (delta && delta < 0) {
    trend = 'negative';
  } else if (!is500k) {
    deltaString = `+/-??? €`;
  } else {
    deltaString = `+/-${deltaString}`;
  }

  return html` <div class="bkb-price-trend-${trend} bkb-price-trend">${deltaString}</div> `;
}
