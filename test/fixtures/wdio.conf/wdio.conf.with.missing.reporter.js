const baseConfig = require('./wdio.conf.js').getConfig();

baseConfig.mochaOpts = {
  ui: 'mocha-typescript',
  compilers: ['ts:ts-node/register'],
  require: ['source-map-support/register'],
  timeout: 20000
};

exports.config = baseConfig;
