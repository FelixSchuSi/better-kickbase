import { browser } from 'webextension-polyfill-ts';

export class KickbaseAjaxFilesSerivce {
  /**
   * A Map of `.json`-files that Kickbase loaded via AJAX.
   * key - name of the file
   * value - content of the file as string
   */
  private map: Map<string, string> = new Map();

  public async setFile(fileName: string, jsonString: string): Promise<void> {
    this.map.set(fileName, jsonString);

    const cachePath: string = 'kickbaseAjaxFiles/' + fileName;
    const cacheEntry: { [s: string]: string } = {};
    cacheEntry[cachePath] = jsonString;
    await browser.storage.local.set(cacheEntry);
  }

  public async getFile(fileName: string): Promise<string | undefined> {
    if (this.map.has(fileName)) {
      return this.map.get(fileName);
    } else {
      const cachePath: string = 'kickbaseAjaxFiles/' + fileName;
      const cache: { [s: string]: string } = await browser.storage.local.get(cachePath);
      return cache[cachePath];
    }
  }
}

export const kickbaseAjaxFilesSerivce: KickbaseAjaxFilesSerivce = new KickbaseAjaxFilesSerivce();
