const browser = require("webextension-polyfill");

function notifyExtension() {
  const content = document.documentElement.outerHTML;
  browser.runtime.sendMessage({dom: content, source: window.location.href});
}

notifyExtension();
