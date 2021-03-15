import type { TemplateResult } from 'lit-html';
import { html } from 'lit-html';
import { interpretPrice } from './helpers/interpret-price';
import { selectAll } from './helpers/select-all';
import { select } from './helpers/select';
import { Selectors } from './helpers/selectors';
import { waitForSelector } from './helpers/wait-for-selector';

export const reListWidget: TemplateResult = html`
  <div class="b-kb-re-list b-kb-btn" @click=${reListButtonClick}>re-list</div>
`;

function reListButtonClick() {
  const players: NodeListOf<HTMLElement> = selectAll(Selectors.ALL_PLAYERS);

  const x: { removedCount: number } = { removedCount: 0 };

  // Take a player off the market when the offer is below
  // the market value or when the offer is expired
  players.forEach((p: HTMLElement) => removePlayerForRelist(p, x));

  if (x.removedCount > 0) {
    listAllPlayers();
  }
}

function removePlayerForRelist(player: HTMLElement, x: { removedCount: number }) {
  const selectors: string[] = [Selectors.OFFER, Selectors.MARKET_VALUE];

  const [angebot, mw]: number[] = selectors.map((selector: string) => {
    const element: HTMLElement | null = player.querySelector(selector);
    const value: number = element ? interpretPrice(element.innerText) : 0;
    return value;
  });

  const isOfferExpired: boolean = !!player.querySelector(Selectors.EXPIRED);

  if (isOfferExpired || mw > angebot) {
    // Take a player off the market
    const removePlayerButton: HTMLElement | null = player.querySelector(Selectors.REMOVE_PLAYER);
    removePlayerButton?.click();
    x.removedCount = x.removedCount + 1;
  }
}

async function listAllPlayers() {
  const addPlayersButton: HTMLElement | null = select(Selectors.ADD_PLAYERS);
  addPlayersButton?.click();
  await waitForSelector(Selectors.SET_LISTING_PRICE);

  const setPriceFields: NodeListOf<HTMLElement> = selectAll(Selectors.SET_LISTING_PRICE);
  setPriceFields.forEach((setPriceField: HTMLElement) => {
    setPriceField.click();
  });

  const listPlayersButton: HTMLElement | null = select(Selectors.LIST_PLAYERS);
  listPlayersButton?.click();
}
