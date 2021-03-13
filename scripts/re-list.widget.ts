import { html, TemplateResult } from 'lit-html';
import { interpretPrice } from './helpers/interpret-price';

export const reListWidget: TemplateResult = html`
  <div class="b-kb-re-list b-kb-btn" @click=${reListButtonClick}>re-list</div>
`;

enum Selectors {
  ALL_PLAYERS = '.players>.playerGroup',
  OFFER = '.playerOffer>.price',
  MARKET_VALUE = '.playerPoints>.price>strong',
  NAME = '.playerName>.lastName',
  EXPIRED = '.playerOffer > .price.expired',
  REMOVE_PLAYER = '.offerWidget>.cancelButton',
  ADD_PLAYERS = '#pageContentWrapper > div > div.TransferMarket.inner > div.leftContainer > div > div > div > div.statusBar > div > button',
  SET_LISTING_PRICE = '.offerWidget > .sellPlayerButton',
  LIST_PLAYERS = '.buttonContainer > .btn.highlighted'
}

function reListButtonClick() {
  const players: NodeListOf<HTMLElement> = document.querySelectorAll(Selectors.ALL_PLAYERS);

  let removedCount: number = 0;

  // Take a player off the market when the offer is below
  // the market value or when the offer is expired
  players.forEach(p => removePlayerForRelist(p, removedCount));

  if (removedCount > 0) {
    listAllPlayers();
  }
}

function removePlayerForRelist(player: HTMLElement, removedCount) {
  const selectors: string[] = [Selectors.OFFER, Selectors.MARKET_VALUE];

  const [angebot, mw]: number[] = selectors.map(selector => {
    const element: HTMLElement | null = player.querySelector(selector);
    const value: number = element ? interpretPrice(element.innerText) : 0;
    return value;
  });

  const isOfferExpired: boolean = !!player.querySelector(Selectors.EXPIRED);

  if (isOfferExpired || mw > angebot) {
    // Take a player off the market
    const removePlayerButton: HTMLElement | null = player.querySelector(Selectors.REMOVE_PLAYER);
    removePlayerButton?.click();
    removedCount++;
  }
}

function listAllPlayers() {
  const addPlayersButton: HTMLElement | null = document.querySelector(Selectors.ADD_PLAYERS);
  addPlayersButton?.click();
  setTimeout(() => {
    const setPriceFields: NodeListOf<HTMLElement> = document.querySelectorAll(Selectors.SET_LISTING_PRICE);
    setPriceFields.forEach(setPriceField => {
      setPriceField.click();
    });

    const listPlayersButton: HTMLElement | null = document.querySelector(Selectors.LIST_PLAYERS);
    listPlayersButton?.click();
  }, 500);
}
