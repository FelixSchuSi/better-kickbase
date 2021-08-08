import type { FunctionComponent } from 'preact';
import { html } from 'htm/preact';
import css from './price-trend.widget.css';
import { priceTrendService } from '../services/price-trend.service';

export type PriceTrendProps = { id: string; is500k: boolean };

const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0
});

export const PriceTrend: FunctionComponent<PriceTrendProps> = (props: PriceTrendProps) => {
  const delta: number | undefined = priceTrendService.getTrend(props.id);
  let deltaString: string = currencyFormatter.format(delta ?? 0);
  let trend: string = 'Neutral';

  if (delta && delta > 0) {
    trend = 'Positive';
    deltaString = `+${deltaString}`;
  } else if (delta && delta < 0) {
    trend = 'Negative';
  } else if (!props.is500k) {
    deltaString = `+/-??? €`;
  } else {
    deltaString = `+/-${deltaString}`;
  }

  return html`
    <span tooltip="Marktwertveränderung beim letzten Marktwertupdate">
      <div class="${css[`bkbPriceTrend${trend}`]} ${css.bkbPriceTrend}">${deltaString}</div>
    </span>
  `;
};
