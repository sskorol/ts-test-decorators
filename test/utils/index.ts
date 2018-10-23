import * as cheerio from 'cheerio';
import * as del from 'del';
import * as fs from 'fs';
import * as http from 'http';
import * as staticServer from 'node-static';
import * as path from 'path';
import * as enableDestroy from 'server-destroy';
import * as Launcher from 'webdriverio/build/lib/launcher';

const resultsDir = path.join(__dirname, '../../.allure-results');
let logs;
let originalConsole;

export function getResults() {
  return getResultFiles('xml').map(file => {
    return cheerio.load(fs.readFileSync(path.join(resultsDir, file), 'utf-8'));
  });
}

export function getResultFiles(patterns) {
  if (!Array.isArray(patterns)) {
    patterns = [patterns];
  }
  return fs.readdirSync(resultsDir).filter(file => patterns.some(pattern => file.endsWith('.' + pattern)));
}

export function clean() {
  return del(resultsDir);
}

export function runMocha(specs, wdioConfigPath = '') {
  const features = specs.map(spec => `./test/fixtures/specs/${spec}.js`);
  const configPath = wdioConfigPath || './test/fixtures/wdio.conf/wdio.conf.mocha.js';

  return run(features, configPath);
}

function run(specs, wdioConfigPath) {
  const testHttpServer = startTestHttpServer();
  disableOutput();
  const launcher = new Launcher(wdioConfigPath, { specs });

  return launcher.run().then(() => {
    enableOutput();
    stopTestHttpServer(testHttpServer);
    return getResults();
  });
}

function disableOutput() {
  if (process.env.FULL_OUTPUT) {
    return;
  }
  const mockLog = type => (...message) => {
    logs[type].push(message.join(' '));
  };
  logs = {
    error: [],
    log: [],
    warn: []
  };
  /* tslint:disable */
  originalConsole = {
    error: console.error,
    log: console.log,
    warn: console.warn
  };
  console.log = mockLog('log');
  console.warn = mockLog('warn');
  console.error = mockLog('error');
  /* tslint:enable */
}

function enableOutput() {
  if (process.env.FULL_OUTPUT) {
    return;
  }
  /* tslint:disable */
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  /* tslint:enable */
}

function startTestHttpServer() {
  const fileServer = new staticServer.Server('./test/fixtures/');

  const server = http.createServer((request, response) => {
    request
      .addListener('end', () => {
        fileServer.serve(request, response);
      })
      .resume();
  });
  server.listen(54392);
  enableDestroy(server);
  return server;
}

function stopTestHttpServer(server) {
  server.destroy();
}
