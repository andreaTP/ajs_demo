module.exports = {
  entry: './main.js',
  output: {
    filename: 'out.js'
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
