const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackWebExt = require("webpack-webext-plugin");

module.exports = {};
module.exports = [
  {
    mode: "production",
    devtool: "source-map",
    entry: {
      background: "./src/background/background.js",
      options: "./src/options/options.js",
    },
    output: {
      path: path.resolve(__dirname, "extension-dist"),
      filename: "[name]/[name].js",
    },
    plugins: [
      new CopyPlugin({
        patterns: [{from: "static", to: "."}],
      }),
      new WebpackWebExt({
        runOnce: false,
        argv: ["lint", "-s", "extension-dist/"],
      }),
      new WebpackWebExt({
        argv: ["run", "-s", "extension-dist/"],
      }),
    ],
  },
  {
    mode: "production",
    devtool: "source-map",
    entry: {
      pageScraper: "./src/contentScript/pageScraper.js",
    },
    output: {
      path: path.resolve(__dirname, "extension-dist"),
      filename: "contentScript/[name].js",
    },
  },
];
