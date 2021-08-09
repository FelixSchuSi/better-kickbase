import type { FunctionComponent, RefObject } from 'preact';
import { render } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import type { Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import type { Tabs } from 'webextension-polyfill-ts';
import { browser } from 'webextension-polyfill-ts';
import { CheckBox } from '../widgets/checkbox.widget';
import { Toast } from '../widgets/toast.widget';
import { Button } from '../widgets/button.widget';

const l: HTMLLinkElement = document.createElement('link');
l.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
l.rel = 'stylesheet';

document.head.appendChild(l);

const initialSettings: Setting[] = [];

const SettingsPage: FunctionComponent = () => {
  const toast: RefObject<{ show: () => void }> = useRef(null);
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    settingsService.get().then((newSettings: Setting[]) => setSettings(newSettings));
  }, []);

  async function onSnackbarClick() {
    const kickbaseTabs: Tabs.Tab[] = await browser.tabs.query({ url: '*://play.kickbase.com/*' });
    kickbaseTabs.forEach((tab: Tabs.Tab) => {
      browser.tabs.reload(tab.id);
    });
  }

  function toggleSetting(id: string, enabled: boolean) {
    const newSettings: Setting[] = settings.map((setting: Setting) => {
      if (setting.id === id) {
        return { ...setting, enabled };
      }
      return setting;
    });

    storeSettings(newSettings);
    setSettings(newSettings);
  }

  function storeSettings(newSettings: Setting[]) {
    settingsService.set(newSettings).then(() => {
      toast.current?.show();
    });
  }

  return (
    <div class="container">
      <h1>Einstellungen better-kickbase</h1>
      <div class="settings-list">
        {settings?.map((setting: Setting) => {
          if (setting.id === '_' && !setting.enabled) return '';
          return (
            <div class="settings-item {setting.id}">
              <div class="icon-label-container">
                {setting.icon ? <div class="material-icons">{setting.icon}</div> : ''}
                <p>{setting.label}</p>
              </div>
              <CheckBox id={setting.id} onChange={toggleSetting} checked={setting.enabled}></CheckBox>
            </div>
          );
        })}
      </div>
      <Toast ref={toast}>
        <span>Einstellungen gespeichert!</span>
        <Button onClick={onSnackbarClick}> Reload </Button>
      </Toast>
      <div class="snackbar-placeholder"></div>
    </div>
  );
};

render(<SettingsPage />, document.querySelector('.settings-root')!);
