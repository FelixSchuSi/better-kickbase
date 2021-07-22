import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { interpretPrice } from './helpers/interpret-price';
import { selectAll } from './helpers/select-all';
import { select } from './helpers/select';
import { Selectors } from './helpers/selectors';

export const exportCsvWidget: TemplateResult = html`
  <div class="bkb-export-file bkb-btn" @click=${downloadAsCSV}>
    <div class="material-icons">file_download</div>
    <span class="bkb-tooltip">Lade eine Excel-Liste der Marktwerte und Angebote deiner Spieler herunter</span>
  </div>
`;

export const exportCopyWidget: TemplateResult = html`
  <div class="bkb-export-copy bkb-btn" @click=${copy}>
    <div class="material-icons">content_copy</div>
    <span class="bkb-tooltip">Kopiere eine Liste der Marktwerte und Angebote deiner Spieler in die Zwischenablage</span>
  </div>
`;

function copy(): void {
  const players: HTMLElement[] = Array.from(selectAll(Selectors.ALL_PLAYERS));
  const playerData: [string, string, number][] = players.map(extractPlayerData);
  const balance: [string, string, number] = extractBalance();
  playerData.unshift(balance);
  const csv: string = toCsv(playerData, { sep: '\t', includeHeader: false });
  copyToClipboard(csv);
}

function downloadAsCSV(): void {
  const players: HTMLElement[] = Array.from(selectAll(Selectors.ALL_PLAYERS));
  const playerData: [string, string, number][] = players.map(extractPlayerData);
  const balance: [string, string, number] = extractBalance();
  playerData.unshift(balance);
  const csv: string = toCsv(playerData);
  createCsvDownload(csv);
}

function extractBalance(): [string, string, number] {
  const balanceElement: HTMLSpanElement | null = select(Selectors.BALANCE);
  const value: number = balanceElement ? interpretPrice(balanceElement.innerText) : 0;
  return ['Account', 'Balance', value];
}

function extractPlayerData(player: HTMLElement): [string, string, number] {
  const selectors: string[] = [Selectors.OFFER, Selectors.MARKET_VALUE];

  const [offer, value]: number[] = selectors.map((selector: string) => {
    const element: HTMLElement | null = player.querySelector(selector);
    const value: number = element ? interpretPrice(element.innerText) : 0;
    return value;
  });

  const firstName: string = (<HTMLElement | null>player.querySelector(Selectors.FIRSTNAME))?.innerText || '';
  const lastName: string = (<HTMLElement | null>player.querySelector(Selectors.LASTNAME))?.innerText || '';
  return offer > 0
    ? [capitalizeFirstLetter(lastName ?? ''), capitalizeFirstLetter(firstName ?? ''), offer]
    : [lastName, firstName, value];
}

function capitalizeFirstLetter(string: string): string {
  if (string === '') return string;
  const result: string = string.toLowerCase();
  return result[0].toUpperCase() + result.slice(1);
}

function toCsv(
  arr: [string, string, number][],
  { sep, includeHeader }: { sep?: string; includeHeader?: boolean } = { sep: ';', includeHeader: false }
): string {
  let result: string = '';
  if (includeHeader) result += `sep=${sep}`;
  for (const row of arr) {
    result += row.join(sep) + '\n';
  }
  return result;
}

function createCsvDownload(csvContent: string): void {
  const a: HTMLAnchorElement = document.createElement('a');
  a.download = 'better-kb.csv';
  a.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
  a.click();
}

function copyToClipboard(value: string): void {
  const textArea: HTMLTextAreaElement = document.createElement('textarea');
  textArea.value = value;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}
