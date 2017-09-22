module.exports = {
  entry: './worker.js',
  output: {
    filename: '../worker-out.js'
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
