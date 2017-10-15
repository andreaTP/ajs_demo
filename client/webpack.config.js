const path = require("path");
module.exports = {
  entry: {
    main: "./main/main.js",
    demo: "./demo/demo.js",
    simple: "./simple/simple.js",
    prime: "./prime/prime.js"
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
