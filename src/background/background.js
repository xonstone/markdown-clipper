const browser = require("webextension-polyfill");
const TurndownService = require("turndown").default;
const Readability = require("readability");
const turndownPluginGfm = require("turndown-plugin-gfm");

function createReadableVersion(dom) {
  const reader = new Readability(dom);
  return reader.parse();
}

function convertArticleToMarkdown(article, source) {
  return browser.storage.sync.get(null).then(function (result) {
    const turndownService = new TurndownService(result.settings);
    if (!!result.gfm) {
      const gfm = turndownPluginGfm.gfm;
      turndownService.use(gfm);
    }

    let markdown = turndownService.turndown(article.content);

    //add summary if exist
    if (!!article.excerpt) {
      markdown = "\n> " + article.excerpt + "\n\n" + markdown;
    }

    //add article titel as header
    const headingStyle = result.settings ? result.settings.headingStyle : ""
    switch (headingStyle) {
      case "atx":
        markdown = "# " + article.title + "\n" + markdown;
        break;
      case "setext":
      default:
        markdown =
          article.title +
          "\n" +
          "=".repeat(article.title.length) +
          "\n" +
          markdown;
        break
    }

    //add source if exist
    if (!!source) {
      markdown = markdown + "\n\n\n" + "[Source](" + source + ")";
    }

    return markdown;
  });
}

function generateValidFileName(title) {
  //remove < > : " / \ | ? *
  const illegalRe = /[\/\?<>\\:\*\|":]/g;
  return title.replace(illegalRe, "");
}

function downloadMarkdown(markdown, article) {
  console.log(markdown);
  const blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  browser.downloads
    .download({
      url: url,
      filename: generateValidFileName(article.title) + ".md",
      saveAs: true,
    })
    .then((id) => {
      browser.downloads.onChanged.addListener((delta) => {
        //release the url for the blob
        if (delta.state && delta.state.current === "complete") {
          if (delta.id === id) {
            window.URL.revokeObjectURL(url);
          }
        }
      });
    })
    .catch((err) => {
      console.error("Download failed" + err);
    });
}

//function that handles messages from the injected script into the site
function notify(message) {
  console.log(message);
  const parser = new DOMParser();
  const dom = parser.parseFromString(message.dom, "text/html");
  if (dom.documentElement.nodeName === "parsererror") {
    console.error("error while parsing");
  }

  const article = createReadableVersion(dom);

  console.log(article);

  convertArticleToMarkdown(article, message.source).then((markdown) =>
    downloadMarkdown(markdown, article)
  );
}

function action() {
  browser.tabs
    .executeScript({
      file: "/contentScript/pageScraper.js",
    })
    .then(() => {
      console.log("Successfully injected");
    })
    .catch((error) => {
      console.error(error);
    });
}

browser.runtime.onMessage.addListener(notify);
browser.browserAction.onClicked.addListener(action);
