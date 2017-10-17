const path = require("path");
module.exports = {
  entry: {
    main: "./main.js",
    demo: "./demo.js",
    simple: "./simple.js",
    prime: "./prime.js",
    pingpong: "./pingpong.js"
  },
  output: {
    path: path.join(__dirname, "js"),
    filename: "[name].out.js",
    chunkFilename: "[id].chunk.js"
  },
  resolve: {
    alias: {
      akkajs: path.resolve('./node_modules/akkajs'),
    },
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
