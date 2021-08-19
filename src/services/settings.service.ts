import { browser } from 'webextension-polyfill-ts';

export interface Setting {
  id: string;
  title: string;
  label: string;
  enabled: boolean;
  icon: string;
  childOption?: ChildOption;
}

export type ChildOptionValue = string | number | string[];
export interface ChildOption {
  id: string;
  label: string;
  value: ChildOptionValue;
}

class SettingsService {
  public static defaultSettings: Setting[] = [
    {
      id: 'csv-export',
      title: 'CSV Export',
      label:
        'Export Button anzeigen, womit eine Liste deiner Spieler und deren Angebote durch einen Klick als CSV Datei heruntergeladen werden kann',
      enabled: true,
      icon: 'file_download'
    },
    {
      id: 'copy-export',
      title: 'Zwischenablage Export',
      label:
        'Export Button anzeigen, womit eine Liste deiner Spieler und deren Angebote durch einen Klick kopiert werden kann',
      enabled: false,
      icon: 'content_copy'
    },
    {
      id: 're-list',
      title: 'Re-List',
      label:
        'Re-List Button anzeigen, womit alle Spieler mit Angebot unter der konfigurierten Grenze durch einen Klick neu gelistet werden können',
      enabled: false,
      icon: 'sync',
      childOption: {
        id: 're-list-threshold',
        label: '',
        value: 0.0
      }
    },
    {
      id: 'block-notifications',
      title: 'Benachrichtigungen blockieren',
      label: 'Alle Kickbase-Benachrichtigungen blockieren',
      enabled: false,
      icon: 'highlight_off'
    },
    {
      id: 'price-trends',
      title: 'Marktwert Trends',
      label: 'Marktwertveränderungen der Spieler beim letzten Marktwertupdate anzeigen',
      enabled: true,
      icon: 'trending_up'
    },
    {
      id: '_',
      title: 'Bietende Spieler',
      label: '',
      enabled: true,
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
        if (match?.childOption) {
          setting.childOption = { ...match.childOption, ...setting.childOption };
          setting.childOption.value = match.childOption.value;
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
