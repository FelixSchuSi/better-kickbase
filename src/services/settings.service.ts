import { browser } from 'webextension-polyfill-ts';

export interface Setting {
  id: string;
  label: string;
  enabled: boolean;
  icon: string;
}

class SettingsService {
  public static defaultSettings: Setting[] = [
    {
      id: 'csv-export',
      label:
        'Export Button anzeigen, womit eine Liste deiner Spieler und deren Angebote durch einen Klick als CSV Datei heruntergeladen werden kann',
      enabled: true,
      icon: 'file_download'
    },
    {
      id: 'copy-export',
      label:
        'Export Button anzeigen, womit eine Liste deiner Spieler und deren Angebote durch einen Klick kopiert werden kann',
      enabled: true,
      icon: 'content_copy'
    },
    {
      id: 're-list',
      label:
        'Re-List Button anzeigen, womit alle Spieler mit Angebot unter Marktwert durch einen Klick neu gelistet werden können',
      enabled: true,
      icon: 'sync'
    },
    {
      id: 'block-notifications',
      label: 'Alle Kickbase-Benachrichtigungen blockieren',
      enabled: true,
      icon: 'highlight_off'
    },
    {
      id: '_',
      label: '',
      enabled: false,
      icon: 'help'
    }
  ];

  public async get(): Promise<Setting[]> {
    const cache: { [s: string]: Setting[] } = await browser.storage.local.get('settings');
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
    await browser.storage.local.set({ settings });
  }
}

export const settingsService: SettingsService = new SettingsService();
