import type { TemplateResult } from 'lit';
import { html, render } from 'lit';
import { exportCopyWidget, exportCsvWidget } from './export.widget';
import { reListWidget } from './re-list.widget';
import { routerService } from './router.service';
import type { Setting } from './settings.service';
import { settingsService } from './settings.service';
import './live-matchday-img-replace';
import { registerPriceTrendsObserver } from './price-trends-observer';
import { browser } from 'webextension-polyfill-ts';
import { kickbaseAjaxFilesSerivce } from './kickbase-ajax-files.service';

const root: HTMLDivElement = document.createElement('div');
root.classList.add('bkb-root');
document.body.append(root);
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
  render(template, root);
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

const p: HTMLParagraphElement = document.createElement('p');
p.id = 'bkb-extension-id';
p.innerHTML = browser.runtime.id;
document.head.appendChild(p);

browser.runtime.onMessage.addListener(({ data }: { data?: string }) => {
  // if (!sender.url?.startsWith('https://api.kickbase.com/')) return; // Only allow Messages from kickbase
  if (data) {
    kickbaseAjaxFilesSerivce.setFile('market.json', data);
  }
});

// Handle injected script for fetching requests of kickbase
const s: HTMLScriptElement = document.createElement('script');
s.src = browser.extension.getURL('scripts/injected.js');
document.head.appendChild(s);
