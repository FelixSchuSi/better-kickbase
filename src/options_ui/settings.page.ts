import type { TemplateResult } from 'lit';
import { css } from 'lit';
import { html, LitElement } from 'lit';
import { query, state } from 'lit/decorators.js';
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

class SettingsPage extends LitElement {
  @state()
  private settings: Setting[] = [];
  @query('.settings-saved')
  private savedSnackbar!: Snackbar;
  static get styles() {
    return css`
      * {
        font-family: 'Open Sans', sans-serif;
      }
      h1,
      p,
      div {
        color: rgba(0, 0, 0, 0.87);
      }
      .settings-list {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .settings-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .container {
        max-width: 800px;
      }
      .icon-label-container {
        display: flex;
      }
      .snackbar-placeholder {
        height: 60px;
      }
      wl-checkbox {
        flex-shrink: 0;
      }
      wl-snackbar > span {
        font-size: 14px;
      }
      .material-icons {
        font-family: 'Material Icons Outlined';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
        margin-right: 1em;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
          ${this.settings.map((setting: Setting) => {
            if (setting.id === '_' && !setting.enabled) return html``;
            return html`
              <div class="settings-item ${setting.id}">
                <div class="icon-label-container">
                  ${setting.icon ? html`<div class="material-icons">${setting.icon}</div>` : html``}
                  <p>${setting.label}</p>
                </div>
                <wl-checkbox id="${setting.id}" @change=${this.toggleSetting} ?checked=${setting.enabled}></wl-checkbox>
              </div>
            `;
          })}
        </div>
        <wl-snackbar class="settings-saved" fixed hideDelay=${3000}>
          <span>Einstellungen gespeichert!</span>
          <wl-button slot="action" flat inverted @click=${this.onSnackbarClick}> Reload </wl-button>
        </wl-snackbar>
        <div class="snackbar-placeholder"></div>
      </div>
    `;
  }
  protected async onSnackbarClick() {
    const kickbaseTabs: Tabs.Tab[] = await browser.tabs.query({ url: '*://play.kickbase.com/*' });
    kickbaseTabs.forEach((tab: Tabs.Tab) => {
      browser.tabs.reload(tab.id);
    });
    this.savedSnackbar.hide();
  }
  protected toggleSetting(e: CustomEvent) {
    const target: HTMLElement = <HTMLElement>e.currentTarget;
    const id: string = target.id;
    this.settings = this.settings.map((setting: Setting) => {
      if (setting.id === id) return { ...setting, enabled: !setting.enabled };
      return setting;
    });
    this.storeSettings();
  }
  protected storeSettings() {
    settingsService.set(this.settings).then(() => {
      this.savedSnackbar.show();
    });
  }
}
customElements.define('bkb-settings', SettingsPage);
