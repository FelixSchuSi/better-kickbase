import type { RefObject } from 'preact';
import { render } from 'preact';
import { html } from 'htm/preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import type { Snackbar } from 'weightless/snackbar';
import type { Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import 'weightless/snackbar';
import 'weightless/checkbox';
import 'weightless/button';
import type { Tabs } from 'webextension-polyfill-ts';
import { browser } from 'webextension-polyfill-ts';

const l: HTMLLinkElement = document.createElement('link');
l.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
l.rel = 'stylesheet';

document.head.appendChild(l);

function SettingsPage(props: { initialSettings: Setting[] } = { initialSettings: [] }) {
  const savedSnackbar: RefObject<Snackbar> = useRef(null);
  const [settings, setSettings] = useState(props.initialSettings);

  useEffect(() => {
    settingsService.get().then((newSettings: Setting[]) => setSettings(newSettings));
  }, []);

  async function onSnackbarClick() {
    const kickbaseTabs: Tabs.Tab[] = await browser.tabs.query({ url: '*://play.kickbase.com/*' });
    kickbaseTabs.forEach((tab: Tabs.Tab) => {
      browser.tabs.reload(tab.id);
    });
    savedSnackbar.current?.hide();
  }

  function toggleSetting(e: CustomEvent) {
    const target: HTMLElement = <HTMLElement>e.currentTarget;
    const id: string = target.id;
    const newSettings: Setting[] = settings.map((setting: Setting) => {
      if (setting.id === id) return { ...setting, enabled: !setting.enabled };
      return setting;
    });
    storeSettings(newSettings);
    setSettings(newSettings);
  }

  function storeSettings(newSettings: Setting[]) {
    settingsService.set(newSettings).then(() => {
      savedSnackbar.current?.show();
    });
  }

  return html`
    <div class="container">
      <h1>Einstellungen better-kickbase</h1>
      <div class="settings-list">
        ${settings?.map((setting: Setting) => {
          if (setting.id === '_' && !setting.enabled) return html``;
          return html`
            <div class="settings-item ${setting.id}">
              <div class="icon-label-container">
                ${setting.icon ? html`<div class="material-icons">${setting.icon}</div>` : html``}
                <p>${setting.label}</p>
              </div>
              <wl-checkbox id="${setting.id}" onChange=${toggleSetting} checked=${setting.enabled}></wl-checkbox>
            </div>
          `;
        })}
      </div>
      <wl-snackbar ref=${savedSnackbar} class="settings-saved" fixed hideDelay=${3000}>
        <span>Einstellungen gespeichert!</span>
        <wl-button slot="action" flat inverted onClick=${onSnackbarClick}> Reload </wl-button>
      </wl-snackbar>
      <div class="snackbar-placeholder"></div>
    </div>
  `;
}

render(html`<${SettingsPage} />`, document.querySelector('.settings-root')!);
