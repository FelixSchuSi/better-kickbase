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

XHR.send = function () {
  this.addEventListener('load', function () {
    const url = this.responseURL;
    try {
      if (url.endsWith('market')) {
        const data = this.response;
        setTimeout(() => {
          chrome.runtime.sendMessage(extensionId, { data });
        }, 5000);
      }
    } catch (err) {
      console.debug('Error reading or processing AJAX response.', err);
    }
  });

  return send.apply(this, arguments);
};
