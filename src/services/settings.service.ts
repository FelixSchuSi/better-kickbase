import { browser } from 'webextension-polyfill-ts';

export interface Setting {
  id: string;
  label: string;
  enabled: boolean;
  icon: string;
  childOptions?: ChildOption[];
}

export interface ChildOption {
  id: string;
  label: string;
  value: string | number;
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
      enabled: false,
      icon: 'content_copy'
    },
    {
      id: 're-list',
      label:
        'Re-List Button anzeigen, womit alle Spieler mit Angebot unter Marktwert durch einen Klick neu gelistet werden können',
      enabled: false,
      icon: 'sync',
      childOptions: [
        {
          id: 're-list-threshold',
          label: '',
          value: 0
        }
      ]
    },
    {
      id: 'block-notifications',
      label: 'Alle Kickbase-Benachrichtigungen blockieren',
      enabled: false,
      icon: 'highlight_off'
    },
    {
      id: 'price-trends',
      label: 'Marktwertveränderungen der Spieler beim letzten Marktwertupdate anzeigen',
      enabled: true,
      icon: 'trending_up'
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
        if (setting.childOptions) {
          setting.childOptions.map((childOpt: ChildOption) => {
            const childOptMatch: ChildOption | undefined = match?.childOptions?.find(
              (e: ChildOption) => e.id === childOpt.id
            );
            if (childOptMatch) {
              childOpt.value = childOptMatch.value ?? '';
            }
          });
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
