import { selectAll } from './helpers/select-all';
import { Selectors } from './helpers/selectors';
import { sleep } from './helpers/sleep';
import { waitForSelector } from './helpers/wait-for-selector';
import { priceTrendService } from './price-trend.service';
import { routerService } from './router.service';

const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0
});

export async function registerPriceTrendsObserver(): Promise<void> {
  await priceTrendService.init();

  routeListener(routerService.getPath());
  routerService.subscribe(routeListener);
}

function parsePlayerRow(row: HTMLDivElement): void {
  const id: string = row.getAttribute('id')!;
  const delta: number | undefined = priceTrendService.getTrend(id);

  const div: HTMLDivElement = document.createElement('div');
  div.id = 'bkb-price-trend';
  let deltaString: string = currencyFormatter.format(delta ?? 0);

  const is500k: boolean = (<HTMLDivElement>row.querySelector('.price > strong')!).innerText === '€ 500.000';
  if (delta && delta > 0) {
    div.classList.add('bkb-price-trend-positive');
    deltaString = `+${deltaString}`;
  } else if (delta && delta < 0) {
    div.classList.add('bkb-price-trend-negative');
  } else if (!is500k) {
    div.classList.add('bkb-price-trend-neutral');
    deltaString = `+/-??? €`;
  } else {
    div.classList.add('bkb-price-trend-neutral');
    deltaString = `+/-${deltaString}`;
  }
  div.innerText = deltaString;
  row.querySelector('.infoBox')!.appendChild(div);
}

async function routeListener(path: string) {
  switch (path) {
    case 'transfermarkt/verkaufen':
    case 'transfermarkt/kaufen':
    case 'transfermarkt/kader': {
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
