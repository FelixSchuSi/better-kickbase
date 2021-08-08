import type { FunctionComponent } from 'preact';
import { html } from 'htm/preact';
import css from './betting-players.widget.css';
import type { MarketPlayer, MarketPlayerOffer } from '../services/market-data.service';

export type BettingPlayersProps = { marketPlayer: MarketPlayer | undefined };

export const BettingPlayers: FunctionComponent<BettingPlayersProps> = ({ marketPlayer }: BettingPlayersProps) => {
  let length: string = '?';
  if (marketPlayer && !marketPlayer.offers) length = '0';
  if (marketPlayer?.offers) length = String(marketPlayer.offers.length);

  return html`
    <div class=${css.bkbBettingPlayers}>
      <div
        class="${css.bkbBettingPlayersPopover} ${length === '?' || length === '0' ? css.bkbBettingPlayersNoPopup : ''}"
      >
        ${marketPlayer?.offers?.map((o: MarketPlayerOffer) => html` <div>${o.userName}</div> `)}
      </div>
      <div class=${css.bkbBettingPlayersNumber}>
        <div>${length}</div>
        <div class="material-icons">people</div>
      </div>
    </div>
  `;
};
