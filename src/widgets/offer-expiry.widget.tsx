import type { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export type OfferExpiryProps = { timeToExpiryInSecs?: number };
const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('de-DE', options);

export const OfferExpiry: FunctionComponent<OfferExpiryProps> = (props: OfferExpiryProps) => {
  if (!props.timeToExpiryInSecs) return <></>;
  const [displayString, setDisplayString] = useState('');

  useEffect(() => {
    const expiryDate: Date = new Date(new Date().valueOf() + props.timeToExpiryInSecs! * 1000);
    setDisplayString(formatter.format(expiryDate));
  }, []);

  return <>{displayString}</>;
};
