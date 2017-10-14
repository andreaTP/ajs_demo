const path = require("path");
module.exports = {
  entry: {
    main: "./main/main.js",
    worker: "./worker/worker.js",
    sharedw: "./sharedw/sharedw.js",
    sharedw2: "./sharedw/sharedw.js",
    sharedw3: "./sharedw/sharedw.js",
    sharedw4: "./sharedw/sharedw.js",
    sharedw5: "./sharedw/sharedw.js",
    sharedw6: "./sharedw/sharedw.js",
    sharedw7: "./sharedw/sharedw.js",
    sharedw8: "./sharedw/sharedw.js"
  },
  output: {
    path: path.join(__dirname, "js"),
    filename: "[name].out.js",
    chunkFilename: "[id].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      }
    ]
  }
}
