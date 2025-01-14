// config-overrides.js
const path = require('path');

module.exports = function override(config, env) {
  // Menambahkan alias untuk path tertentu
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/components'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@pages': path.resolve(__dirname, 'src/pages'),
  };

  // Menambahkan custom loader untuk file CSS atau style lainnya (jika diperlukan)
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  });

  // Menambahkan plugin (misalnya, jika Anda ingin menambahkan dotenv untuk variabel lingkungan)
  const webpack = require('webpack');
  config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']));

  // Mengubah konfigurasi devServer (misalnya, jika Anda ingin mengubah pengaturan port atau middleware)
  config.devServer = {
    ...config.devServer,
    port: 3001, // Ubah port default jika diperlukan
    historyApiFallback: true, // Memungkinkan routing dengan React Router
  };

  return config;
};
