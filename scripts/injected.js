const XHR = XMLHttpRequest.prototype;

const open = XHR.open;
const send = XHR.send;
const setRequestHeader = XHR.setRequestHeader;

const editorExtensionId = 'lkjgfahbhdghgfhjidandcbbmnfeeccn';

console.log('injected script loaded!');

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
    const responseHeaders = this.getAllResponseHeaders();
    try {
      if (url.endsWith('market')) {
        const data = this.response;
        console.log('Countdown');
        setTimeout(() => {
          chrome.runtime.sendMessage(editorExtensionId, { data }, function (response) {
            // if (!response.success) console.log('error in sendMessaeg: ', response);
            console.log('Sending msg from main thread');
          });
        }, 5000);
      }
    } catch (err) {
      console.debug('Error reading or processing AJAX response.', err);
    }
  });

  return send.apply(this, arguments);
};
