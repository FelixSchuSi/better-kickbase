import { exportCopyWidget, exportCsvWidget } from './export.widget';
import { reListWidget } from './re-list.widget';
import { routerService } from '../services/router.service';
import type { Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import './live-matchday-img-replace';
import { registerPlayerRowObserver } from './player-row-observer';
import css from './root.widget.css';
import { waitForSelector } from '../helpers/wait-for-selector';
import { Selectors } from '../helpers/selectors';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const initialTemplates: JSX.Element[] = [];
const RootWidget: FunctionComponent = () => {
  const [route, setRoute] = useState(routerService.getPath());
  const [templates, setTemplates] = useState(initialTemplates);
  const [reListEnabled, setReListEnabled] = useState(false);

  useEffect(() => {
    registerPlayerRowObserver();

    settingsService.get().then((settings: Setting[]) => {
      let blockNotifications: boolean = false;
      const _templates: JSX.Element[] = [];
      for (const setting of settings) {
        if (!setting.enabled) continue;
        if (setting.id === 're-list') setReListEnabled(true);
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

  return (
    <>
      {route.startsWith('transfermarkt') ? templates : ''}
      {reListEnabled && route === 'transfermarkt/verkaufen' ? reListWidget : ''}
    </>
  );
};

const root: HTMLElement = document.createElement('div');
root.classList.add(css.root);

waitForSelector(Selectors.BODY).then((e: Element | null) => {
  e!.append(root);
  ReactDOM.render(<RootWidget />, root);
});
