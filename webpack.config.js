const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

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
