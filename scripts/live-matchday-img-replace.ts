import { selectAll } from './helpers/select-all';
import { Selectors } from './helpers/selectors';

const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
  mutations.some((record: MutationRecord) => {
    record.addedNodes.forEach((e: Node) => {
      if (e instanceof HTMLElement && e.classList?.contains('live')) {
        console.log(e);
        const playerImages: HTMLImageElement[] = <HTMLImageElement[]>(
          Array.from(selectAll(Selectors.LIVE_MATCHDAY_IMG, e))
        );
        for (const playerImage of playerImages) {
          if (playerImage.src.endsWith('/2')) {
            const newSrc: string = playerImage.src.replace(/\/2$/, '/1');
            console.log(playerImage.src, newSrc);
            playerImage.src = newSrc;
          }
        }
      }
    });
    return false;
  });
});

observer.observe(document, {
  childList: true,
  subtree: true
});
