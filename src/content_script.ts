import { browser } from 'webextension-polyfill-ts';
import { kickbaseAjaxFilesSerivce } from './services/kickbase-ajax-files.service';
import { marketDataService } from './services/market-data.service';
import './widgets/root.widget';

const p: HTMLParagraphElement = document.createElement('p');
p.id = 'bkb-extension-id';
p.innerHTML = browser.runtime.id;
document.head.appendChild(p);

function onObservedAjaxFile(data: string | undefined, filename: string | undefined) {
  if (data && filename) {
    kickbaseAjaxFilesSerivce.setFile(filename, data);
    if (filename === 'market') {
      marketDataService.processRawData(JSON.parse(data).players);
    }
  }
}

let isFireFox: boolean = false;
try {
  // `exportFunction` is available in Firefox addons
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  isFireFox = !!exportFunction;
  // eslint-disable-next-line no-empty
} catch (e) {}

if (isFireFox) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  exportFunction(onObservedAjaxFile, window, { defineAs: 'onObservedAjaxFile' });
} else {
  // Running in a chromium based browser
  browser.runtime.onMessage.addListener(async ({ data, filename }: { data?: string; filename?: string }) => {
    onObservedAjaxFile(data, filename);
  });
}

// Inject web_accessible_resource to observe ajax requests of kickbase
const s: HTMLScriptElement = document.createElement('script');
s.type = 'module';
s.src = browser.extension.getURL('src/web_accessible_resource.js');
document.head.appendChild(s);
