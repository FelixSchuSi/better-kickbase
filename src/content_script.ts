import { browser } from 'webextension-polyfill-ts';
import { kickbaseAjaxFilesSerivce } from './services/kickbase-ajax-files.service';
import { marketDataService } from './services/market-data.service';

import './widgets/root.widget';

const p: HTMLParagraphElement = document.createElement('p');
p.id = 'bkb-extension-id';
p.innerHTML = browser.runtime.id;
document.head.appendChild(p);

browser.runtime.onMessage.addListener(async ({ data }: { data?: string }) => {
  // TODO: find out where to include this filter
  // if (!sender.url?.startsWith('https://api.kickbase.com/')) return; // Only allow Messages from kickbase
  if (data) {
    kickbaseAjaxFilesSerivce.setFile('market.json', data);
    marketDataService.processRawData(JSON.parse(data).players);
  }
});

// Inject web_accessible_resource for fetching requests of kickbase
const s: HTMLScriptElement = document.createElement('script');
s.src = browser.extension.getURL('src/web_accessible_resource.js');
document.head.appendChild(s);
