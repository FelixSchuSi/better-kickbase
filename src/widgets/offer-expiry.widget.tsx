import type { FunctionComponent } from 'preact';

export type OfferExpiryProps = { timeToExpiryInSecs?: number };
const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('de-DE', options);

export const OfferExpiry: FunctionComponent<OfferExpiryProps> = (props: OfferExpiryProps) => {
  if (!props.timeToExpiryInSecs) return <></>;
  const expiryDate: Date = new Date(new Date().valueOf() + props.timeToExpiryInSecs * 1000);
  const distplayString: string = formatter.format(expiryDate);
  return <>{distplayString}</>;
};
