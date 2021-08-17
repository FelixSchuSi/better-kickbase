import css from './price-trend.widget.css';
import { priceTrendService } from '../services/price-trend.service';
import { Tooltip } from './tooltip.widget';
import type { FunctionComponent } from 'react';
import React from 'react';

export type PriceTrendProps = { id: string; is500k: boolean; hide: boolean };

const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0
});

export const PriceTrend: FunctionComponent<PriceTrendProps> = (props: PriceTrendProps) => {
  if (props.hide) return <></>;
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

  return (
    <Tooltip text="Marktwertveränderung beim letzten Marktwertupdate">
      <div className={`${css[`bkbPriceTrend${trend}`]} ${css.bkbPriceTrend}`}>{deltaString}</div>
    </Tooltip>
  );
};
