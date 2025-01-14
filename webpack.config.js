const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point aplikasi Anda
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    port: 3000,
    setupMiddlewares: (middlewares, devServer) => {
      // Middleware untuk logging request URL
      devServer.app.use((req, res, next) => {
        console.log('Request URL:', req.url);
        next();
      });

      return middlewares;
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Untuk kompilasi JavaScript menggunakan Babel
      },
    ],
  },
};
