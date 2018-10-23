exports.getConfig = function() {
  return {
    baseUrl: 'http://localhost:54392',
    coloredLogs: true,
    logLevel: 'silent',
    services: ['phantomjs'],
    reporters: ['allure'],
    framework: 'mocha',
    reporterOptions: {
      allure: {
        outputDir: '.allure-results'
      }
    },
    sync: false,
    capabilities: [{
      browserName: 'phantomjs'
    }]
  };
};
