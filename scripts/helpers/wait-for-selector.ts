import type { Selectors } from './selectors';

export function waitForSelector<E extends Element>(
  selector: Selectors,
  element: Document | E = document,
  timeout: number = 3000
): Promise<E | null> {
  // eslint-disable-next-line @typescript-eslint/typedef
  return new Promise((resolve, reject) => {
    const t0: number = Date.now();
    let result: E | null;

    const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[], me: MutationObserver) => {
      result = element.querySelector(selector);
      if (result) {
        const t1: number = Date.now();
        console.log(`Element nach ${t1 - t0} ms gefunden `, result);
        me.disconnect();
        resolve(result);
      }
    });

    window.setTimeout(() => {
      if (!result) {
        reject(`No element of selector ${selector} was found.`);
      }
    }, timeout);

    observer.observe(document, {
      childList: true,
      subtree: true
    });

    result = element.querySelector(selector);
    if (result) {
      console.log('Element direkt gefunden! ', result);
      resolve(result);
    }
  });
}
