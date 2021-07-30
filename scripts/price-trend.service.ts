interface PriceTrends {
  date: string;
  players: PriceTrend[];
}

interface PriceTrend {
  lastName: string;
  delta: number;
}

class PriceTrendService {
  //   public async getFromCache(): Promise<PriceTrends> {
  //     // await browser.storage.sync.get('settings');
  //   }

  //   public async setCache(trends: PriceTrends): Promise<void> {
  //     // await browser.storage.sync.set({ settings: settings });
  //   }

  public async getFromLigainsider(): Promise<any> {
    // const x: Response = await fetch('https://raw.githubusercontent.com/FelixSchuSi/better-kickbase/main/manifest.json');
    // // const [winner, loser]: string[] = await Promise.all([
    // //   this.fetch('https://www.ligainsider.de/stats/kickbase/marktwerte/tag/gewinner/').then((res: Response) =>
    // //     res.text()
    // //   ),
    // //   this.fetch('https://www.ligainsider.de/stats/kickbase/marktwerte/tag/verlierer/').then((res: Response) =>
    // //     res.text()
    // //   )
    // // ]);
    // // const asdf: PriceTrend[] = [
    // //   ...this.ligainsiderHtmlToPriceTrend(winner),
    // //   ...this.ligainsiderHtmlToPriceTrend(loser)
    // // ];
    // console.log(await x.json());
    // debugger;
  }

  private fetch(url: string): Promise<any> {
    return new Promise((res: (value: any) => void) => {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          res(xhr.responseText);
        }
      };
      xhr.send();
    });
  }

  private ligainsiderHtmlToPriceTrend(html: string): PriceTrend[] {
    const parser: DOMParser = new DOMParser();
    const parsedHmtl: Document = parser.parseFromString(html, 'text/html');
    const rows: HTMLElement[] = Array.from(parsedHmtl.querySelectorAll('tbody > tr'));
    return rows.map((element: HTMLElement) => {
      const lastName: string = (<HTMLAnchorElement>element.querySelector('td > strong > a')).innerText;
      const unparsedDelta: string = (<HTMLAnchorElement>element.querySelector('td:nth-child(9)')).innerText;
      const delta: number = Number(unparsedDelta.replace(/(€|\.)/, ''));
      return { lastName, delta };
    });
  }
  //   public getTrend(lastName: string): number {}
}

export const priceTrendService: PriceTrendService = new PriceTrendService();
