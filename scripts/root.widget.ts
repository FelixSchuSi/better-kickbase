import type { TemplateResult } from 'lit-html';
import { html, render } from 'lit-html';
import { exportCopyWidget, exportCsvWidget } from './export.widget';
import { reListWidget } from './re-list.widget';
import { routerService } from './router.service';
import './live-matchday-img-replace';
import type { Setting } from './settings.service';
import { settingsService } from './settings.service';

const root: HTMLDivElement = document.createElement('div');
root.classList.add('bkb-root');
document.body.append(root);
let settings: Setting[];
let renderReList: boolean = false;
let renderCsvExport: boolean = false;
let renderCopyExport: boolean = false;

function renderTemplate(path: string) {
  let template: TemplateResult = html``;
  switch (path) {
    case 'transfermarkt/verkaufen':
      template = html`
        ${renderReList ? reListWidget : ''} ${renderCsvExport ? exportCsvWidget : ''}
        ${renderCopyExport ? exportCopyWidget : ''}
      `;
      break;
    default:
      break;
  }
  render(template, root);
}

settingsService
  .get()
  .then((s: Setting[]) => (settings = s))
  .then(() => {
    let blockNotifications: boolean = false;
    for (const setting of settings) {
      if (setting.id === 're-list') renderReList = setting.enabled;
      if (setting.id === 'csv-export') renderCsvExport = setting.enabled;
      if (setting.id === 'copy-export') renderCopyExport = setting.enabled;
      if (setting.id === 'block-notifications') blockNotifications = setting.enabled;
    }

    renderTemplate(routerService.getPath());
    routerService.subscribe(renderTemplate);

    if (blockNotifications) {
      const style: HTMLStyleElement = document.createElement('style');
      style.innerText = `
        .notification {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  });
