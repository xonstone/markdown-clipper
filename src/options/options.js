const browser = require("webextension-polyfill");

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    settings: {
      headingStyle: document.querySelector("#headingStyle").value,
      hr: document.querySelector("#hr").value,
      bulletListMarker: document.querySelector("#bulletListMarker").value,
      codeBlockStyle: document.querySelector("#codeBlockStyle").value,
      fence: document.querySelector("#fence").value,
      emDelimiter: document.querySelector("#emDelimiter").value,
      strongDelimiter: document.querySelector("#strongDelimiter").value,
      linkStyle: document.querySelector("#linkStyle").value,
      linkReferenceStyle: document.querySelector("#linkReferenceStyle").value,
    },
    gfm: document.querySelector("#gfm").checked,
  });
}

function restoreOptions() {
  function setGFM(result) {
    console.log(result);
    if (!!result) {
      document.querySelector("#gfm").checked = result.gfm;
    }
  }

  function setSettings(result) {
    console.log(result);
    if (!!result) {
      for (let [key, value] of Object.entries(result.settings)) {
        console.log(key, value);
        if (!!value) {
          document.getElementById(key).value = value;
        }
      }
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let gfm = browser.storage.sync.get("gfm");
  gfm.then(setGFM, onError);

  let settings = browser.storage.sync.get("settings");
  settings.then(setSettings, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
