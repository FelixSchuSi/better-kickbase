import { browser } from 'webextension-polyfill-ts';

export interface Setting {
  id: string;
  label: string;
  enabled: boolean;
  icon: string
}

class SettingsService {
  public static defaultSettings: Setting[] = [
    {
      id: 'csv-export',
      label: 'Export Button anzeigen, um Spieler und Angebote per Mausplick als CSV Datei zu exportieren',
      enabled: true,
      icon: 'file_download'
    },
    {
      id: 'copy-export',
      label: 'Export Button anzeigen, um Spieler und Angebote per Mausplick zu kopieren',
      enabled: false,
      icon: 'content_copy'
    },
    {
      id: 're-list',
      label:
        'Re-List Button anzeigen, um Angebote für ein Spieler unter seinem Marktwert abzulehnen und diesen Spieler neu zu listen',
      enabled: false,
      icon: 'sync'
    },
    {
      id: 'block-notifications',
      label: 'Benachrichtigungen blockieren',
      enabled: true,
      icon: 'highlight_off'
    }
  ];

  public async get(): Promise<Setting[]> {
    const cache: { [s: string]: Setting[] } = await browser.storage.sync.get('settings');

    if (cache && cache.settings) {
      const cachedSettings: Setting[] = cache.settings;
      return SettingsService.defaultSettings.map((setting: Setting) => {
        const match: Setting | undefined = cachedSettings.find(
          (cachedSetting: Setting) => cachedSetting.id === setting.id
        );
        if (match) {
          setting.enabled = match.enabled;
        }
        return setting;
      });
    }
    return SettingsService.defaultSettings;
  }

  public async set(settings: Setting[]): Promise<void> {
    await browser.storage.sync.set({ settings: settings });
  }
}

export const settingsService: SettingsService = new SettingsService();
