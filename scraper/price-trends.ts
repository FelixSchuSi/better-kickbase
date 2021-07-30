import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { writeFileSync } from 'fs';
import * as path from 'path';

interface PriceTrends {
  date: string;
  players: PriceTrend[];
}

type PriceTrendWithoutId = Omit<PriceTrend, 'kickbaseId'>;

interface PriceTrend {
  lastName: string;
  delta: number;
  detailPageLink: string;
  kickbaseId: string;
}

async function gethtmlFromUrl(url: string): Promise<string> {
  const response: AxiosResponse<string> = await axios(url);
  return response.data;
}

function ligainsiderHtmlToPriceTrend(html: string): PriceTrendWithoutId[] {
  const dom: JSDOM = new JSDOM(html);

  const rows: HTMLElement[] = Array.from(dom.window.document.querySelectorAll('.table-responsive tbody > tr'));
  return rows.map((element: HTMLElement) => {
    const lastName: string = (<HTMLAnchorElement>element.querySelector('td > strong > a')).innerHTML;
    const unparsedDelta: string = (<HTMLAnchorElement>element.querySelector('td:nth-child(9) > strong')).innerHTML;
    const delta: number = Number(unparsedDelta.replace(/(\.)/g, '').replace(/(€)/g, ''));
    const linkPrefix: string = 'https://www.ligainsider.de';

    const linkPostFix: string = element.querySelector('td:nth-child(3) > strong > a')!.getAttribute('href')!;
    const detailPageLink: string = `${linkPrefix}${linkPostFix}`;
    return { lastName, delta, detailPageLink };
  });
}

async function getKickbaseId(priceTrend: PriceTrendWithoutId): Promise<PriceTrend> {
  const html: string = await gethtmlFromUrl(priceTrend.detailPageLink);
  const dom: JSDOM = new JSDOM(html);

  const anchor: HTMLAnchorElement | null = dom.window.document.querySelector('a.btn_box');
  const link: string | null | undefined = anchor?.getAttribute('href');

  const kickbaseId: string = link?.split('?')[0]!.split('/')[5] ?? '-1';
  return { ...priceTrend, kickbaseId };
}

async function main() {
  const [winnerUrl, loserUrl]: string[] = [
    'https://www.ligainsider.de/stats/kickbase/marktwerte/tag/gewinner/',
    'https://www.ligainsider.de/stats/kickbase/marktwerte/tag/verlierer/'
  ];

  const [winnerHtml, loserHtml]: string[] = await Promise.all(
    [winnerUrl, loserUrl].map((url: string) => gethtmlFromUrl(url))
  );

  const priceTrendsWithoutIds: PriceTrendWithoutId[] = [
    ...ligainsiderHtmlToPriceTrend(winnerHtml),
    ...ligainsiderHtmlToPriceTrend(loserHtml)
  ];

  const priceTrends: PriceTrend[] = await Promise.all(priceTrendsWithoutIds.map(getKickbaseId));

  const priceTrendObj: PriceTrends = {
    date: new Date().toISOString().split('T')[0],
    players: priceTrends
  };
  writeFileSync(path.join(__dirname, 'price-trends.json'), JSON.stringify(priceTrendObj));
}

main();
