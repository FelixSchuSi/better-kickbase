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

async function getPrevPriceTrends(): Promise<PriceTrends> {
  const response: AxiosResponse<string> = await axios(
    'https://raw.githubusercontent.com/FelixSchuSi/better-kickbase/price-trends-data/price-trends.json'
  );
  return <PriceTrends>(<unknown>response.data);
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

export const sleep = (duration: number): Promise<unknown> =>
  new Promise((resolve: TimerHandler) => setTimeout(resolve, duration));

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

  const firstPlayerFromGH: PriceTrend = (await getPrevPriceTrends()).players[0];
  const firstPlayerGenerated: PriceTrend = priceTrendObj.players[0];

  console.log('generated: ', firstPlayerGenerated);
  console.log('from GH: ', firstPlayerFromGH);

  if (
    firstPlayerGenerated.kickbaseId === firstPlayerFromGH.kickbaseId &&
    firstPlayerGenerated.delta === firstPlayerFromGH.delta
  ) {
    console.error('The market data was not yet updated on Ligainsider');
    console.error('Restarting in 15 mins');
    await sleep(15 * 60 * 1000);
    return main();
  } else {
    writeFileSync(path.join(__dirname, 'price-trends.json'), JSON.stringify(priceTrendObj));
  }
}

main();
