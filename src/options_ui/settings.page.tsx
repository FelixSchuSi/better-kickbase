import type { FunctionComponent, RefObject } from 'preact';
import { render } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import type { ChildOption, Setting } from '../services/settings.service';
import { settingsService } from '../services/settings.service';
import type { Tabs } from 'webextension-polyfill-ts';
import { browser } from 'webextension-polyfill-ts';
import { CheckBox } from '../widgets/checkbox.widget';
import { Toast } from '../widgets/toast.widget';
import { Button } from '../widgets/button.widget';
import { select } from '../helpers/select';
import { Selectors } from '../helpers/selectors';
import { ReListThreshold } from '../widgets/re-list-threshold.widget';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

const l: HTMLLinkElement = document.createElement('link');
l.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
l.rel = 'stylesheet';

document.head.appendChild(l);

const initialSettings: Setting[] = [];

const SettingsPage: FunctionComponent = () => {
  const toast: RefObject<{ show: () => void }> = useRef(null);
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    settingsService.get().then((newSettings: Setting[]) => setSettings(newSettings));
  }, []);

  async function onSnackbarClick() {
    const kickbaseTabs: Tabs.Tab[] = await browser.tabs.query({ url: '*://play.kickbase.com/*' });
    kickbaseTabs.forEach((tab: Tabs.Tab) => {
      browser.tabs.reload(tab.id);
    });
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
      toast.current?.show();
    });
  }

  // return (
  //   <div class="container">
  //     <h1>Einstellungen better-kickbase</h1>
  //     <div class="settings-list">
  //       {settings?.map((setting: Setting) => {
  //         if (setting.id === '_' && !setting.enabled) return '';
  //         return (
  //           <div class="settings-item">
  //             <div class="icon-label-container">
  //               {setting.icon ? <div class="material-icons">{setting.icon}</div> : ''}
  //               <p>{setting.label}</p>
  //             </div>
  //             <CheckBox id={setting.id} onChange={toggleSetting} checked={setting.enabled}></CheckBox>
  //             {setting.childOptions
  //               ? setting.childOptions.map((childOpt: ChildOption) => {
  //                   if (childOpt.id === 're-list-threshold') return <ReListThreshold data={childOpt}></ReListThreshold>;
  //                   return '';
  //                 })
  //               : ''}
  //           </div>
  //         );
  //       })}
  //     </div>
  //     <Toast ref={toast}>
  //       <span>Einstellungen gespeichert!</span>
  //       <Button onClick={onSnackbarClick}> Reload </Button>
  //     </Toast>
  //     <div class="snackbar-placeholder"></div>
  //   </div>
  // );

  return (
    <div>
      <Accordion>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled>
        <AccordionSummary aria-controls="panel3a-content" id="panel3a-header">
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
};

render(<SettingsPage />, select(Selectors.BKB_ROOT)!);
