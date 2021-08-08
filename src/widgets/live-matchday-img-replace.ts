import { selectAll } from '../helpers/select-all';
import { Selectors } from '../helpers/selectors';
import { routerService } from '../services/router.service';

let runObserver: boolean = false;

routeListener(routerService.getPath());
routerService.subscribe(routeListener);

/**
 * On the livematchday page old player images are used.
 * This observer rewrites the image urls to current player images.
 */
const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
  if (!runObserver) return;
  mutations.forEach((record: MutationRecord) => {
    record.addedNodes.forEach((e: Node) => {
      if (e instanceof HTMLElement && e.classList?.contains('live')) {
        const playerImages: HTMLImageElement[] = <HTMLImageElement[]>(
          Array.from(selectAll(Selectors.LIVE_MATCHDAY_IMG, e))
        );
        for (const playerImage of playerImages) {
          if (playerImage.src.endsWith('/2')) {
            const newSrc: string = playerImage.src.replace(/\/2$/, '/1');
            playerImage.src = newSrc;
          }
        }
      }
    });
  });
});

observer.observe(document, {
  childList: true,
  subtree: true
});

async function routeListener(path: string) {
  switch (path) {
    case 'livematchday': {
      runObserver = true;
      break;
    }
    default: {
      runObserver = false;
      break;
    }
  }
}
