import type { TemplateResult } from 'lit';
import { html, render } from 'lit';
import { exportCopyWidget, exportCsvWidget } from './export.widget';
import { reListWidget } from './re-list.widget';
import { routerService } from '../services/router.service';
import type { Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import './live-matchday-img-replace';
import { registerPriceTrendsObserver } from './price-trends-observer';
// import { browser } from 'webextension-polyfill-ts';
// import { kickbaseAjaxFilesSerivce } from '../services/kickbase-ajax-files.service';
// import { marketDataService } from '../services/market-data.service';

// TODO: refector to web component
// include styles of class '.bkb-root' in styles

registerPriceTrendsObserver();
const templates: TemplateResult[] = [];

function renderTemplate(path: string) {
  let template: TemplateResult = html``;
  switch (path) {
    case 'transfermarkt/verkaufen':
      template = html` ${templates} `;
      break;
    default:
      break;
  }
  render(template, <HTMLDivElement>document.querySelector('.bkb-root')!);
}

settingsService.get().then((settings: Setting[]) => {
  let blockNotifications: boolean = false;
  for (const setting of settings) {
    if (!setting.enabled) continue;
    if (setting.id === 're-list') templates.push(reListWidget);
    if (setting.id === 'csv-export') templates.push(exportCsvWidget);
    if (setting.id === 'copy-export') templates.push(exportCopyWidget);
    if (setting.id === 'block-notifications') blockNotifications = setting.enabled;
  }

  if (blockNotifications) {
    const style: HTMLStyleElement = document.createElement('style');
    style.innerText = `
        .notification {
          display: none !important;
        }
      `;
    document.head.appendChild(style);
  }

  renderTemplate(routerService.getPath());
  routerService.subscribe(renderTemplate);
});
