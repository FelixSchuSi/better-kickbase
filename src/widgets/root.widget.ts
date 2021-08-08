import type { VNode } from 'preact';
import { render } from 'preact';
import { html } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks';
import { exportCopyWidget, exportCsvWidget } from './export.widget';
import { reListWidget } from './re-list.widget';
import { routerService } from '../services/router.service';
import type { Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import './live-matchday-img-replace';
import { registerPlayerRowObserver } from './player-row-observer';
import css from './root.widget.css';

function RootWidget(props: { initialTemplates: VNode[] } = { initialTemplates: [] }) {
  const [route, setRoute] = useState(routerService.getPath());
  const [templates, setTemplates] = useState(props.initialTemplates);

  useEffect(() => {
    registerPlayerRowObserver();
    settingsService.get().then((settings: Setting[]) => {
      let blockNotifications: boolean = false;

      const _templates: VNode[] = [];
      for (const setting of settings) {
        if (!setting.enabled) continue;
        if (setting.id === 're-list') _templates.push(reListWidget);
        if (setting.id === 'csv-export') _templates.push(exportCsvWidget);
        if (setting.id === 'copy-export') _templates.push(exportCopyWidget);
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

      setTemplates(_templates);

      routerService.subscribe((route: string) => setRoute(route));
    });
  }, []);

  return html` ${route === 'transfermarkt/verkaufen' ? html`${templates}` : ''} `;
}

const root: HTMLElement = document.createElement('div');
root.classList.add(css.root);
document.body.append(root);

render(html`<${RootWidget} />`, root);
