import { html, TemplateResult } from 'lit-html';
import { interpretPrice } from './helpers/interpret-price';

export const exportWidget: TemplateResult = html`
  <div class="b-kb-export">
    <div class="b-kb-export-file b-kb-btn" @click=${downloadAsCSV}>file</div>
    <div class="b-kb-export-copy b-kb-btn">copy</div>
  </div>
`;

enum Selectors {
  ALL_PLAYERS = '.players>.playerGroup',
  OFFER = '.playerOffer>.price',
  MARKET_VALUE = '.playerPoints>.price>strong',
  LASTNAME = '.playerName>.lastName',
  FIRSTNAME = '.playerName>.firstName',
  EXPIRED = '.playerOffer > .price.expired',
  REMOVE_PLAYER = '.offerWidget>.cancelButton',
  ADD_PLAYERS = '#pageContentWrapper > div > div.TransferMarket.inner > div.leftContainer > div > div > div > div.statusBar > div > button',
  SET_LISTING_PRICE = '.offerWidget > .sellPlayerButton',
  LIST_PLAYERS = '.buttonContainer > .btn.highlighted',
  BALANCE = '.active > .leagueBudget > .content'
}

function downloadAsCSV(): void {
  const players: HTMLElement[] = Array.from(document.querySelectorAll(Selectors.ALL_PLAYERS));
  const playerData: [string, string, number][] = players.map(extractPlayerData);
  const balance = extractBalance();
  playerData.unshift(balance);
  const csv: string = toCsv(playerData);
  createCsvDownload(csv);
}

function extractBalance(): [string, string, number] {
  debugger;
  const balanceElement: HTMLSpanElement | null = document.querySelector(Selectors.BALANCE);
  const value = balanceElement ? interpretPrice(balanceElement.innerText) : 0;
  return ['your', 'balance', value];
}

function extractPlayerData(player: HTMLElement): [string, string, number] {
  const selectors: string[] = [Selectors.OFFER, Selectors.MARKET_VALUE];

  const [offer, value]: number[] = selectors.map(selector => {
    const element: HTMLElement | null = player.querySelector(selector);
    const value: number = element ? interpretPrice(element.innerText) : 0;
    return value;
  });

  const firstName = (<HTMLElement | null>player.querySelector(Selectors.FIRSTNAME))?.innerText || '';
  const lastName = (<HTMLElement | null>player.querySelector(Selectors.LASTNAME))?.innerText || '';
  return offer > 0 ? [lastName, firstName, offer] : [lastName, firstName, value];
}

function toCsv(arr: [string, string, number][]): string {
  let result: string = 'sep=,\n';
  for (const row of arr) {
    result += row.join(',') + '\n';
  }
  return result;
}

function createCsvDownload(csvContent: string): void {
  const a: HTMLAnchorElement = document.createElement('a');
  a.download = 'better-kb.csv';
  a.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
  a.click();
}
