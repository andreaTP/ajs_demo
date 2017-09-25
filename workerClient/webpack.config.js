const path = require("path");
module.exports = {
  entry: {
		main: "./main/main.js",
		worker: "./worker/worker.js"
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
