#!/usr/bin/env node

import http from 'http'
import debug from 'debug'

import makeApp from '../src/app.js'

function onError(error) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('dutch_oven:express')('Listening on ' + bind);
}

function normalizePort(val) {
  const port = parseInt(val, 10);

  if(isNaN(port)) return val;
  if(port >= 0) return port;
  return false;
}

let config;
if (process.argv.length > 2)
  config = JSON.parse(process.argv[2]);
const app = makeApp(config);

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
