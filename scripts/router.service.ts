export type QueryParameter = Record<string, string>;
export type RouteListener = (relUrl: string) => void;
export type Unsubscribe = () => void;

export class RouterService {
  private listeners: RouteListener[] = [];

  constructor() {
    window.onpopstate = (): void => this.notifyListeners();
    document.addEventListener('click', (event: MouseEvent) => {
      if (!this.shouldIgnoreEvent(event)) {
        const anchor: HTMLAnchorElement = this.getAnchor(event); // a-Element ermitteln
        if (anchor && !this.shouldIgnoreAnchor(anchor)) {
          this.notifyListeners();
        }
      }
    });
  }

  public subscribe(listener: RouteListener): Unsubscribe {
    this.listeners.push(listener);
    return (): void => {
      // unsubscribe function
      this.listeners = this.listeners.filter((other: RouteListener) => other !== listener);
    };
  }

  public getPath(): string {
    return this.withoutRootPath(location.pathname);
  }

  private notifyListeners(): void {
    setTimeout(() => {
      const path: string = this.getPath();
      this.listeners.forEach((listener: RouteListener) => listener(path));
    }, 200);
  }

  private shouldIgnoreEvent(event: MouseEvent): boolean {
    return event.button !== 0 || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
  }

  private getAnchor(event: MouseEvent): HTMLAnchorElement {
    for (const target of event.composedPath ? event.composedPath() : []) {
      if (this.isAnchor(target as HTMLElement)) {
        return target as HTMLAnchorElement;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let elem: any = event.target;
    while (elem && !this.isAnchor(elem)) {
      elem = elem.parentNode;
    }
    return elem && this.isAnchor(elem) ? elem : null;
  }

  private isAnchor(elem: HTMLElement): boolean {
    return !!elem.nodeName && elem.nodeName.toLowerCase() === 'a';
  }

  private shouldIgnoreAnchor(anchor: HTMLAnchorElement): boolean {
    if (anchor.target && anchor.target.toLowerCase() !== '_self') {
      return true; // it has a non-default target
    }

    if (anchor.hasAttribute('download')) {
      return true;
    }

    if (this.withRootPath(anchor.pathname) === window.location.pathname && anchor.hash !== '') {
      return true; // target URL is a fragment on the current page
    }

    const origin: string = anchor.origin || this.getAnchorOrigin(anchor);
    if (origin !== window.location.origin) {
      return true; // target is external to the app
    }
    return false;
  }

  private getAnchorOrigin(anchor: HTMLAnchorElement): string {
    const port: string = anchor.port;
    const protocol: string = anchor.protocol;
    const defaultHttp: boolean = protocol === 'http:' && port === '80';
    const defaultHttps: boolean = protocol === 'https:' && port === '443';
    const host: string = defaultHttp || defaultHttps ? anchor.hostname : anchor.host;
    return `${protocol}//${host}`;
  }

  private withRootPath(relURL: string): string {
    if (relURL.startsWith('/')) {
      return relURL;
    } else {
      return '/' + (relURL.startsWith('/') ? relURL.substring(1) : relURL);
    }
  }

  private withoutRootPath(relURL: string): string {
    if (relURL.startsWith('/')) {
      return relURL.substring('/'.length);
    } else {
      return relURL;
    }
  }
}

export const routerService: RouterService = new RouterService();
