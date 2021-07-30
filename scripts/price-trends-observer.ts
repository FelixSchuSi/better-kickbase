import { selectAll } from './helpers/select-all';
import { Selectors } from './helpers/selectors';
import { priceTrendService } from './price-trend.service';

const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0
});

export async function registerPriceTrendsObserver(): Promise<void> {
  try {
    await priceTrendService.init();
  } catch (e) {
    console.log(e);
  }
  const observer: MutationObserver = new MutationObserver(async (mutations: MutationRecord[]) => {
    mutations.forEach((record: MutationRecord) => {
      record.addedNodes.forEach((e: Node) => {
        if (e instanceof HTMLElement) {
          if (e.classList.contains(Selectors.PLAYERROW)) {
            parsePlayerRow(<HTMLDivElement>e);
          } else {
            const playerRows: HTMLDivElement[] = <HTMLDivElement[]>Array.from(selectAll(Selectors.PLAYERROW, e));
            playerRows.forEach(parsePlayerRow);
          }
        }
      });
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

function parsePlayerRow(row: HTMLDivElement): void {
  const id: string = row.getAttribute('id')!;
  const delta: number | undefined = priceTrendService.getTrend(id);

  const div: HTMLDivElement = document.createElement('div');
  div.id = 'bkb-price-trend';
  let deltaString: string = currencyFormatter.format(delta ?? 0);
  if (delta && delta > 0) {
    div.classList.add('bkb-price-trend-positive');
    deltaString = `+${deltaString}`;
  } else if (delta && delta < 0) {
    div.classList.add('bkb-price-trend-negative');
  } else {
    div.classList.add('bkb-price-trend-neutral');
    deltaString = `+/-${deltaString}`;
  }
  div.innerText = deltaString;
  row.querySelector('.infoBox')!.appendChild(div);
}
