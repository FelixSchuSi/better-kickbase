import type { TemplateResult } from 'lit-element';
import { query } from 'lit-element';
import { internalProperty } from 'lit-element';
import { css } from 'lit-element';
import { html, LitElement } from 'lit-element';
import type { Snackbar } from 'weightless/snackbar';
import type { Setting } from './settings.service';
import { settingsService } from './settings.service';
import 'weightless/snackbar';
import 'weightless/checkbox';
import 'weightless/button';

const l: HTMLLinkElement = document.createElement('link');
l.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
l.rel = 'stylesheet';

document.head.appendChild(l);

class SettingsPage extends LitElement {
  @internalProperty()
  private settings: Setting[] = [];
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

  protected async firstUpdated(): Promise<void> {
    this.settings = await settingsService.get();
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
                    @change=${this.toggleSetting}
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

  protected toggleSetting(e: CustomEvent) {
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
    settingsService.set(this.settings).then(() => {
      this.savedSnackbar.show();
    });
  }
}
customElements.define('bkb-settings', SettingsPage);
