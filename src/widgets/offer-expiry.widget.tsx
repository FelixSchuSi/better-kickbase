import { Tooltip } from './tooltip.widget';
import css from './offer-expiry.widget.css';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';

export type OfferExpiryProps = { timeToExpiryInSecs?: number; timeToExpiryString: string };
const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('de-DE', options);

export const OfferExpiry: FunctionComponent<OfferExpiryProps> = (props: OfferExpiryProps) => {
  if (!props.timeToExpiryInSecs) return <></>;
  const [displayString, setDisplayString] = useState('');

  useEffect(() => {
    const expiryDate: Date = new Date(new Date().valueOf() + props.timeToExpiryInSecs! * 1000);
    setDisplayString(formatter.format(expiryDate));
  }, []);

  return (
    <Tooltip class={css.root} text={displayString}>
      <div className="time">{props.timeToExpiryString}</div>
    </Tooltip>
  );
};
