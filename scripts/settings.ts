import type { TemplateResult } from 'lit-element';
import { query } from 'lit-element';
import { internalProperty } from 'lit-element';
import { css } from 'lit-element';
import { html, LitElement } from 'lit-element';
import type { Snackbar } from 'weightless/snackbar';
import { browser } from 'webextension-polyfill-ts';

import 'weightless/snackbar';
import 'weightless/checkbox';
import 'weightless/button';
import 'weightless/label';

console.log('Shit loaded');
interface Setting {
  id: string;
  label: string;
  enabled: boolean;
}

const defaultSettings: Setting[] = [
  {
    id: 'csv-export',
    label: 'Export Button anzeigen, um Spieler und Angebote per Mausplick als CSV Datei zu exportieren',
    enabled: true
  },
  {
    id: 'copy-export',
    label: 'Export Button anzeigen, um Spieler und Angebote per Mausplick zu kopieren',
    enabled: false
  },
  {
    id: 're-list',
    label:
      'Re-List Button anzeigen, um Angebote für ein Spieler unter seinem Marktwert abzulehnen und diesen Spieler neu zu listen',
    enabled: false
  },
  {
    id: 'block-notifications',
    label: 'Benachrichtigungen blockieren',
    enabled: false
  }
];

class SettingsPage extends LitElement {
  @internalProperty()
  private settings: Setting[] = defaultSettings;
  @query('.settings-saved')
  private savedSnackbar!: Snackbar;

  static get styles() {
    return css`
      .settings-list {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .settings-item {
        display: flex;
        justify-content: space-between;
      }
      .container {
        max-width: 800px;
      }
      wl-snackbar > span {
        font-size: 14px;
      }
    `;
  }

  constructor() {
    super();
    browser.storage.sync.get('settings').then((result: any) => {
      if (result && result.settings) {
        // this.settings = result.settings;
        const cachedSettings: Setting[] = result.settings;
        this.settings = this.settings.map((setting: Setting) => {
          const match: Setting | undefined = cachedSettings.find(
            (cachedSetting: Setting) => cachedSetting.id === setting.id
          );
          if (match) {
            setting.enabled = match.enabled;
          }
          return setting;
        });
      }
    });
  }

  protected render(): TemplateResult {
    return html`
      <div class="container">
        <h1>Einstellungen better-kickbase</h1>
        <div class="settings-list">
          ${this.settings.map(
            (setting: Setting) =>
              html`
                <div class="settings-item ${setting.id}">
                  <p>${setting.label}</p>
                  <wl-checkbox
                    id="${setting.id}"
                    @change=${this.changeSetting}
                    ?checked=${setting.enabled}
                  ></wl-checkbox>
                </div>
              `
          )}
        </div>
        <wl-snackbar class="settings-saved" fixed hideDelay=${3000}>
          <span>Einstellungen gespeichert!</span>
          <wl-button slot="action" flat inverted @click=${() => this.savedSnackbar.hide()}>OK</wl-button>
        </wl-snackbar>
      </div>
    `;
  }

  protected changeSetting(e: CustomEvent) {
    const target: HTMLElement = <HTMLElement>e.currentTarget;
    const id: string = target.id;
    this.settings = this.settings.map((setting: Setting) => {
      if (setting.id === id) return { ...setting, enabled: !setting.enabled };
      return setting;
    });
    console.log(this.settings);
    this.storeSettings();
  }

  protected storeSettings() {
    browser.storage.sync
      .set({
        settings: this.settings
      })
      .then(() => {
        this.savedSnackbar.show();
      });
  }
}
customElements.define('bkb-settings', SettingsPage);
