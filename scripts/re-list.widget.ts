import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { interpretPrice } from './helpers/interpret-price';
import { selectAll } from './helpers/select-all';
import { select } from './helpers/select';
import { Selectors } from './helpers/selectors';
import { waitForSelector } from './helpers/wait-for-selector';
import { sleep } from './helpers/sleep';

export const reListWidget: TemplateResult = html`
  <div class="bkb-re-list bkb-btn" @click=${reListButtonClick}>
    <span class="material-icons"> sync </span>
    <span class="bkb-tooltip">Hole neue Angebote für Spieler ein, deren Angebote unter dem Marktwert liegt</span>
  </div>
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
    const value: number = element ? interpretPrice(element.innerText) : -1;
    return value;
  });

  const isOfferExpired: boolean = !!player.querySelector(Selectors.EXPIRED);

  if (isOfferExpired || (angebot !== -1 && mw > angebot)) {
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
  // A SET_LISTING_PRICE button of ONE player was found
  // Not all Buttons for all players are rendered at the same time.
  // We wait another 100ms so all buttons are rendered
  await sleep(100);

  const setPriceFields: NodeListOf<HTMLElement> = selectAll(Selectors.SET_LISTING_PRICE);
  setPriceFields.forEach((setPriceField: HTMLElement) => {
    setPriceField.click();
  });

  const listPlayersButton: HTMLElement | null = select(Selectors.LIST_PLAYERS);
  listPlayersButton?.click();
}
