import { interpretPrice } from '../helpers/interpret-price';
import { selectAll } from '../helpers/select-all';
import { select } from '../helpers/select';
import { Selectors } from '../helpers/selectors';
import { waitForSelector } from '../helpers/wait-for-selector';
import { sleep } from '../helpers/sleep';
import { Button } from './button.widget';
import React from 'react';

export const reListWidget: JSX.Element = (
  <Button
    icon="sync"
    onClick={reListButtonClick}
    tooltip="Hole neue Angebote für Spieler ein, deren Angebote unter dem Marktwert liegt"
  ></Button>
);

async function reListButtonClick() {
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
  const selectors: Selectors[] = [Selectors.OFFER, Selectors.MARKET_VALUE];

  const [offer, marketValue]: number[] = selectors.map((selector: Selectors) => {
    const elements: HTMLElement[] = Array.from(selectAll(selector, player));

    if (selector === Selectors.OFFER) {
      const hasOfferNotFromTransfermarket: HTMLElement | undefined = elements.find((offer: HTMLElement) => {
        return (offer.parentElement!.querySelector('.playerInfo') as HTMLDivElement).innerText !== 'KICKBASE';
      });

      // When a offer from another manager is present, dont reject the offer.
      if (hasOfferNotFromTransfermarket) return 999999999;
    }

    const value: number = elements ? interpretPrice(elements[0].innerText) : -1;
    return value;
  });

  const isOfferExpired: boolean = !!player.querySelector(Selectors.EXPIRED);

  if (isOfferExpired || isOfferTooLow(offer, marketValue, 0)) {
    // Take a player off the market
    const removePlayerButton: HTMLElement | null = player.querySelector(Selectors.REMOVE_PLAYER);
    removePlayerButton?.click();
    x.removedCount = x.removedCount + 1;
  }
}

/**
 * Determines wheter a offer for a player is too low.
 * When a offer is too low the player gets relisted to get a better offer.
 * @param offer
 * @param marketValue
 * @param threshold A percentage set by the user that determines how much higher (positive number) or lower (negative number) the offer has to be in comparison the market value. e. g. `0.05`
 * @returns `true` if the offer is too low, otherwise `false`
 */
function isOfferTooLow(offer: number, marketValue: number, threshold: number): boolean {
  if (offer === -1) return false;
  return marketValue * (1 + threshold) < offer;
}

async function listAllPlayers() {
  const addPlayersButton: HTMLElement | null = select(Selectors.ADD_PLAYERS);
  addPlayersButton?.click();

  await waitForSelector(Selectors.SET_LISTING_PRICE);
  // A SET_LISTING_PRICE button of ONE player was found
  // Not all Buttons for all players are rendered at the same time.
  // We wait another 100ms so all buttons are rendered
  await sleep(2000);

  const setPriceFields: NodeListOf<HTMLElement> = selectAll(Selectors.SET_LISTING_PRICE);
  setPriceFields.forEach((setPriceField: HTMLElement) => {
    setPriceField.click();
  });

  const listPlayersButton: HTMLElement | null = select(Selectors.LIST_PLAYERS);
  listPlayersButton?.click();
}
