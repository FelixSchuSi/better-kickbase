const XHR = XMLHttpRequest.prototype;

const open = XHR.open;
const send = XHR.send;
const setRequestHeader = XHR.setRequestHeader;

const extensionId = document.querySelector('#bkb-extension-id').innerHTML;

XHR.open = function () {
  this._requestHeaders = {};
  return open.apply(this, arguments);
};

XHR.setRequestHeader = function (header, value) {
  this._requestHeaders[header] = value;
  return setRequestHeader.apply(this, arguments);
};

const isFireFox = !window.chrome;

XHR.send = function () {
  this.addEventListener('load', function () {
    const url = this.responseURL;
    try {
      if (url.endsWith('market') || url.endsWith('lineupex')) {
        const data = this.response;
        const filename = url.split('/').pop();

        if (isFireFox) {
          // This function as exposed from the content script using `exportFunction` see: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#exportfunction
          onObservedAjaxFile(data, filename);
        } else {
          // In Chromium based browsers we send the observed ajax requests via messaging to the bg-script
          setTimeout(() => {
            chrome.runtime.sendMessage(extensionId, { data, filename });
          }, 5000);
        }
      }
    } catch (err) {
      console.debug('Error reading or processing AJAX response.', err);
    }
  });
  return send.apply(this, arguments);
};
