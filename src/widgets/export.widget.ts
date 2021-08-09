import { html } from 'htm/preact';
import type { VNode } from 'preact';
import { interpretPrice } from '../helpers/interpret-price';
import { select } from '../helpers/select';
import { Selectors } from '../helpers/selectors';
import { kickbaseAjaxFilesSerivce } from '../services/kickbase-ajax-files.service';
import type { MarketPlayer, Player } from '../services/market-data.service';
import { marketDataService } from '../services/market-data.service';
import { Button } from './button.widget';

export const exportCsvWidget: VNode = html`
  <${Button} icon=file_download tooltip="Lade eine Excel-Liste der Marktwerte und Angebote deiner Spieler herunter" onClick=${downloadAsCSV}></${Button}>
`;

export const exportCopyWidget: VNode = html`
  <${Button} icon=content_copy tooltip="Kopiere eine Liste der Marktwerte und Angebote deiner Spieler in die Zwischenablage" onClick=${copy}></${Button}>
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
  const marketData: MarketPlayer[] = await marketDataService.getOwnPlayerData();
  const allPlayersString: string | undefined = await kickbaseAjaxFilesSerivce.getFile('lineupex');
  if (!allPlayersString) return;
  const allPlayers: Player[] = JSON.parse(allPlayersString).players;
  const playerData: [string, string, number, number][] = allPlayers.map((p: Player) => {
    const listedPlayer: MarketPlayer | undefined = marketData.find(
      (marketPlayer: MarketPlayer) => marketPlayer.id === p.id
    );
    const offer: number | undefined = listedPlayer?.offers[0].price;
    return [p.lastName, p.firstName, p.marketValue, offer ?? 0];
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
