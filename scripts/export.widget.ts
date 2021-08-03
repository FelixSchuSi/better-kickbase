import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { interpretPrice } from './helpers/interpret-price';
import { select } from './helpers/select';
import { Selectors } from './helpers/selectors';
import type { MarketPlayer } from './market-data.service';
import { marketDataService } from './market-data.service';
import { kickbaseAjaxFilesSerivce } from './kickbase-ajax-files.service';

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

async function copy(): Promise<void> {
  const playerData: [string, string, number, number][] | undefined = await getData();
  if (!playerData) return;
  const balance: [string, string, number, number] = extractBalance();
  playerData.unshift(balance);
  const labels: string[] = ['Nachname', 'Vorname', 'Marktwert', 'Angebot'];
  playerData.unshift(<never>labels);
  const csv: string = toCsv(playerData, { sep: '\t', includeHeader: false });
  copyToClipboard(csv);
}

async function downloadAsCSV(): Promise<void> {
  const playerData: [string, string, number, number][] | undefined = await getData();
  if (!playerData) return;
  const balance: [string, string, number, number] = extractBalance();
  playerData.unshift(balance);
  const labels: string[] = ['Nachname', 'Vorname', 'Marktwert', 'Angebot'];
  playerData.unshift(<never>labels);
  const csv: string = toCsv(playerData);
  createCsvDownload(csv);
}

async function getData(): Promise<[string, string, number, number][] | undefined> {
  const file: string | undefined = await kickbaseAjaxFilesSerivce.getFile('market.json');
  if (!file) return;
  marketDataService.marketData = JSON.parse(file).players;
  const players: MarketPlayer[] = marketDataService.ownPlayerData;
  const playerData: [string, string, number, number][] = players.map((p: MarketPlayer) => {
    return [p.lastName, p.firstName, p.marketValue, p.price];
  });
  return playerData;
}

function extractBalance(): [string, string, number, number] {
  const balanceElement: HTMLSpanElement | null = select(Selectors.BALANCE);
  const value: number = balanceElement ? interpretPrice(balanceElement.innerText) : 0;
  return ['Dein', 'Kontostand', value, 0];
}

function toCsv(
  arr: [string, string, number, number][],
  { sep, includeHeader }: { sep?: string; includeHeader?: boolean } = { sep: ';', includeHeader: false }
): string {
  // BOM tells excel that encoding is utf8
  const BOM: string = String.fromCharCode(0xfeff);
  let result: string = BOM;
  if (includeHeader) result += `sep=${sep}`;
  for (const row of arr) {
    result += row.join(sep) + '\n';
  }
  return result;
}

function createCsvDownload(csvContent: string): void {
  const a: HTMLAnchorElement = document.createElement('a');

  a.download = 'better-kb.csv';

  const blob: Blob = new Blob([csvContent], { type: 'text/csv;charset=UTF-8' });
  a.href = window.URL.createObjectURL(blob);
  document.body.append(a);
  a.click();
  document.body.removeChild(a);
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
