// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');
module.exports = function override(config) {
  config.resolve.fallback = Object.assign(config.resolve.fallback || {}, {
    "assert": require.resolve("assert"),
    "crypto": require.resolve("crypto-browserify"),
    "events": require.resolve("events/"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url"),
    "util": require.resolve("util/"),
    "zlib": require.resolve("browserify-zlib")
  });
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
        fullySpecified: false
    }
  });
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);
  return config;
}