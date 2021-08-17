import css from './betting-players.widget.css';
import type { MarketPlayer, MarketPlayerOffer } from '../services/market-data.service';
import { Tooltip } from './tooltip.widget';
import type { FunctionComponent } from 'react';
import React from 'react';

export type BettingPlayersProps = { marketPlayer: MarketPlayer | undefined; hide: boolean };

export const BettingPlayers: FunctionComponent<BettingPlayersProps> = ({ marketPlayer, hide }: BettingPlayersProps) => {
  if (hide) return <></>;
  let length: string = '?';
  if (marketPlayer && !marketPlayer.offers) length = '0';
  if (marketPlayer?.offers) length = String(marketPlayer.offers.length);
  return (
    <Tooltip class={css.root} text={marketPlayer?.offers?.map((o: MarketPlayerOffer) => o.userName).join(' ') ?? ''}>
      <div className={css.bkbBettingPlayersNumber}>
        <div>{length}</div>
        <div className="material-icons">people</div>
      </div>
    </Tooltip>
  );
};
