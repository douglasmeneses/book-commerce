const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', 
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, 
      },
    },
    port: 3000, 
    historyApiFallback: true, 
  },
};