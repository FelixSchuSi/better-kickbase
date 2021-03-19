import type { TemplateResult } from 'lit-html';
import { html } from 'lit-html';
import { interpretPrice } from './helpers/interpret-price';
import { selectAll } from './helpers/select-all';
import { select } from './helpers/select';
import { Selectors } from './helpers/selectors';

export const exportWidget: TemplateResult = html`
  <div class="bkb-export">
    <div class="bkb-export-file bkb-btn" @click=${downloadAsCSV}>file</div>
    <div class="bkb-export-copy bkb-btn" @click=${copy}>copy</div>
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
  return ['your', 'balance', value];
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
  return offer > 0 ? [lastName, firstName, offer] : [lastName, firstName, value];
}

function toCsv(
  arr: [string, string, number][],
  { sep, includeHeader }: { sep?: string; includeHeader?: boolean } = { sep: '\n', includeHeader: false }
): string {
  let result: string = '';
  if (includeHeader) result += `sep=,${sep}`;
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
