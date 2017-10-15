const path = require("path");
module.exports = {
  entry: {
    main: "./main.js",
    demo: "./demo.js",
    simple: "./simple.js",
    prime: "./prime.js"
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
