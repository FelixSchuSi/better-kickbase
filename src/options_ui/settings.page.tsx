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
import {
  CardActions,
  IconButton,
  Button,
  CardContent,
  Card,
  List,
  Snackbar,
  Typography,
  withStyles
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import CloseIcon from '@material-ui/icons/Close';

import { SettingItem } from './setting-item.widget';

import css from './settings.page.css';

// eslint-disable-next-line @typescript-eslint/typedef
const StyledRating = withStyles({
  iconFilled: {
    color: '#c2c2c2'
  },
  iconHover: {
    color: '#10b27f'
  }
})(Rating);

const l: HTMLLinkElement = document.createElement('link');
l.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
l.rel = 'stylesheet';

document.head.appendChild(l);

const initialSettings: Setting[] = [];
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
        <Card variant="outlined" className={css.ratingCard}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Lass' eine Bewertung da!
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Eine gute Bewertung ist der beste Weg better-kickbase zu unterstützen.
            </Typography>
          </CardContent>
          <CardActions className={css.ratingCardActions}>
            <Button href="https://chrome.google.com/webstore/detail/better-kickbase/jdkehjokegcepbmbmcbaojnpkmnolgkg/reviews">
              <Typography component="legend">Chrome</Typography>
              <StyledRating
                className={css.rating}
                value={4}
                onChange={() => {
                  window.location.href =
                    'https://chrome.google.com/webstore/detail/better-kickbase/jdkehjokegcepbmbmcbaojnpkmnolgkg/reviews';
                }}
              />
            </Button>
            <Button href="https://addons.mozilla.org/de/firefox/addon/better-kickbase/">
              <Typography component="legend">Firefox</Typography>
              <StyledRating
                className={css.rating}
                value={4}
                onChange={() => {
                  window.location.href = 'https://addons.mozilla.org/de/firefox/addon/better-kickbase/';
                }}
              />
            </Button>
          </CardActions>
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
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<SettingsPage />, select(Selectors.BKB_ROOT)!);
