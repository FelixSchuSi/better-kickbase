import type { ChildOption, ChildOptionValue, Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import type { Tabs } from 'webextension-polyfill-ts';
import { browser } from 'webextension-polyfill-ts';
import { select } from '../helpers/select';
import { Selectors } from '../helpers/selectors';
import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import type { Theme } from '@material-ui/core/styles';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '@fontsource/roboto';
import { IconButton, Divider, CardContent, Card, List, Snackbar, Button, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { SettingItem } from './setting-item.widget';

import css from './settings.page.css';
const l: HTMLLinkElement = document.createElement('link');
l.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
l.rel = 'stylesheet';

document.head.appendChild(l);

const initialSettings: Setting[] = [];
window.resizeTo(1920, 1080);
const SettingsPage: FunctionComponent = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const showSnackbar = () => {
    setSnackbarOpen(true);
  };
  const hideSnackbar = () => {
    setSnackbarOpen(false);
  };

  const theme: Theme = createTheme({
    palette: {
      type: 'dark',
      secondary: {
        main: '#10b27f'
      },
      primary: {
        main: '#10b27f'
      }
    }
  });
  useEffect(() => {
    settingsService.get().then((newSettings: Setting[]) => setSettings(newSettings));
  }, []);

  async function onSnackbarClick() {
    const kickbaseTabs: Tabs.Tab[] = await browser.tabs.query({ url: '*://play.kickbase.com/*' });
    kickbaseTabs.forEach((tab: Tabs.Tab) => {
      browser.tabs.reload(tab.id);
    });
    setSnackbarOpen(false);
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

  function childOptChange(settingId: string, value: ChildOptionValue) {
    const newSettings: Setting[] = settings.map((setting: Setting) => {
      if (setting.id === settingId) {
        if (setting.childOption) {
          const newChildOpt: ChildOption = { ...setting.childOption, value };
          return { ...setting, childOption: newChildOpt };
        }
      }
      return setting;
    });

    console.log(newSettings);
    storeSettings(newSettings);
    setSettings(newSettings);
  }

  function storeSettings(newSettings: Setting[]) {
    settingsService.set(newSettings).then(() => {
      showSnackbar();
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <div className={css.headerWrapper}>
          <div className={css.headerGradient}></div>
          <Typography className={css.header} variant="h4">
            better-kickbase Einstellungen
          </Typography>
        </div>
        <Card className={css.card} variant="outlined">
          <List>
            {settings?.map((setting: Setting, i: number) => (
              <>
                <SettingItem
                  index={i}
                  setting={setting}
                  onChange={(enabled: boolean) => {
                    toggleSetting(setting.id, enabled);
                  }}
                  onChildOptChange={(value: ChildOptionValue) => {
                    childOptChange(setting.id, value);
                  }}
                />
              </>
            ))}
          </List>
        </Card>
        <Snackbar
          message="Einstellungen gespeichert!"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={snackbarOpen}
          action={
            <>
              <Button color="secondary" size="small" onClick={onSnackbarClick}>
                Reload
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={hideSnackbar}>
                <CloseIcon fontSize="small" />
              </IconButton>
              ;
            </>
          }
        />
        <div className="snackbar-placeholder"></div>
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<SettingsPage />, select(Selectors.BKB_ROOT)!);
