const path = require("path")
module.exports = {
  entry: {
    main: "./main.js",
    todo: "./todo.js",
    validator: "./validator.js",
    simple: "./simple.js",
    prime: "./prime.js",
    pingpong: "./pingpong.js",
    twitter: "./twitter.js"
  },
  output: {
    path: path.join(__dirname, "js"),
    filename: "[name].out.js",
    chunkFilename: "[id].chunk.js"
  },
  resolve: {
    alias: {
      akkajs: path.resolve("./node_modules/akkajs")
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
}
