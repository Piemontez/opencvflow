module.exports = [
    {
      mode: 'development',
      entry: './ide/index.ts',
      target: 'electron-main',
      module: {
        rules: [{
          test: /\.ts$/,
          include: /ide/,
          include: /plugins/,
          use: [{ loader: 'ts-loader' }]
        }]
      },
      output: {
        path: __dirname + '/dist',
        filename: 'index.js'
      }
    }
  ];