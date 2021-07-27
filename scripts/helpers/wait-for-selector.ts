import type { Selectors } from './selectors';

export function waitForSelector<E extends Element>(
  selector: Selectors,
  element: Document | E = document,
  timeout: number = 3000
): Promise<E | null> {
  // eslint-disable-next-line @typescript-eslint/typedef
  return new Promise((resolve, reject) => {
    let result: E | null;

    const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[], me: MutationObserver) => {
      result = element.querySelector(selector);
      if (result) {
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
      resolve(result);
    }
  });
}
