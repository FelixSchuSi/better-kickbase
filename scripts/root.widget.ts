import type { TemplateResult } from 'lit';
import { html, render } from 'lit';
import { exportCopyWidget, exportCsvWidget } from './export.widget';
import { reListWidget } from './re-list.widget';
import { routerService } from './router.service';
import type { Setting } from './settings.service';
import { settingsService } from './settings.service';
import './live-matchday-img-replace';

const root: HTMLDivElement = document.createElement('div');
root.classList.add('bkb-root');
document.body.append(root);

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
