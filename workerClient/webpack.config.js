const path = require("path");
module.exports = {
  entry: {
    main: "./main/main.js",
    demo: "./demo/demo.js",
    local: "./local/local.js",
    prime1: "./prime/prime.js",
    prime2: "./prime/prime.js",
    prime3: "./prime/prime.js",
    prime4: "./prime/prime.js",
    prime5: "./prime/prime.js",
    prime6: "./prime/prime.js",
    prime7: "./prime/prime.js",
    prime8: "./prime/prime.js"
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
