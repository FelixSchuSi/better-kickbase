import type { ChildOption, Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import type { Tabs } from 'webextension-polyfill-ts';
import { browser } from 'webextension-polyfill-ts';
import Button from '@material-ui/core/Button';
import { select } from '../helpers/select';
import { Selectors } from '../helpers/selectors';
import type { FunctionComponent, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { IconSet } from './icon-map';
import { iconMap } from './icon-map';
import type { Theme } from '@material-ui/core/styles';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '@fontsource/roboto';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import GetAppIcon from '@material-ui/icons/GetApp';
import RestorePageIcon from '@material-ui/icons/RestorePage';

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

  function storeSettings(newSettings: Setting[]) {
    settingsService.set(newSettings).then(() => {
      showSnackbar();
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <Typography variant="h4">Einstellungen better-kickbase</Typography>

        {settings?.map((setting: Setting) => {
          if (setting.id === '_' && !setting.enabled) return '';
          const hasChildOptions: boolean = setting.childOptions !== undefined;
          const { Icon, CheckedIcon }: IconSet = iconMap[setting.icon]!;
          return (
            <>
              <Accordion expanded={hasChildOptions ? undefined : false}>
                <AccordionSummary
                  className={css.accordionSummary}
                  expandIcon={
                    hasChildOptions ? <Checkbox icon={<SettingsIcon />} checkedIcon={<SettingsIcon />} /> : ''
                  }
                >
                  <FormControlLabel
                    className={css.fromControl}
                    onClick={(event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
                      event.stopPropagation();
                    }}
                    onFocus={(event: React.FocusEvent<HTMLLabelElement>) => {
                      event.stopPropagation();
                    }}
                    control={
                      <Checkbox
                        className={css.settingIconCheckbox}
                        onClick={() => toggleSetting(setting.id, !setting.enabled)}
                        defaultChecked={setting.enabled}
                        icon={<Icon />}
                        checkedIcon={<CheckedIcon />}
                      />
                    }
                    label={<Typography color="textPrimary">{setting.label}</Typography>}
                  />
                </AccordionSummary>

                <AccordionDetails>
                  <Typography color="textSecondary">Moin</Typography>
                </AccordionDetails>
              </Accordion>
            </>
          );
        })}

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

export default function SwitchListSecondary() {
  const [checked, setChecked] = React.useState(['wifi']);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List subheader={<ListSubheader>Settings</ListSubheader>}>
      <ListItem>
        <ListItemIcon>
          <GetAppIcon />
        </ListItemIcon>
        <ListItemText
          id="switch-list-label-wifi"
          primary="CSV Export"
          secondary="Export Button anzeigen, womit eine Liste deiner Spieler und deren Angebote durch einen Klick als CSV Datei heruntergeladen werden kann"
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={handleToggle('wifi')}
            checked={checked.indexOf('wifi') !== -1}
            inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <RestorePageIcon />
        </ListItemIcon>
        <ListItemText
          id="switch-list-label-bluetooth"
          primary="Re-List"
          secondary="Re-List Button anzeigen, womit alle Spieler mit Angebot unter Marktwert durch einen Klick neu gelistet werden können"
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={handleToggle('bluetooth')}
            checked={checked.indexOf('bluetooth') !== -1}
            inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

ReactDOM.render(<SwitchListSecondary />, select(Selectors.BKB_ROOT)!);
