import type { Tabs } from 'webextension-polyfill-ts';
import { browser } from 'webextension-polyfill-ts';

browser.runtime.onMessageExternal.addListener(async ({ data }: { data?: string }) => {
  if (data) {
    const tabs: Tabs.Tab[] = await browser.tabs.query({ url: '*://play.kickbase.com/*' });

    tabs.forEach((tab: Tabs.Tab) => {
      browser.tabs.sendMessage(tab.id!, { data });
    });
  }
});
