import http from 'http';
import cluster from 'cluster';

import app from './app';
import logger from './utils/logger';

// ServerInfo decorator method
const addServerInfo = (serverInfo: ServerInfo, fn: (...args:any[]) => void) =>
      (...args:any[]) => fn(serverInfo, ...args);

// start point
boot();

function boot() {
  const isDevelopmentEnv = app.get('env') === 'development';
  const numCPUs = isDevelopmentEnv ? 1 : Math.min(8, require('os').cpus().length);

  if (!isDevelopmentEnv && cluster.isMaster) {
    // this is the master process
    for (let i = 0; i < numCPUs; i += 1) {
      cluster.fork();
    }
    cluster.on('online', onClusterOnline);
    cluster.on('exit', onClusterExit);
  } else {
    startServer();
  }
}

function startServer() {
  // Create HTTP server.
  logger.info('Starting server...');
  const server = http.createServer(app);
  const port = app.get('port');
  const serverInfo = { server, port };
  // Setup event handlers
  logger.info('Setting up server event handlers...');
  server.on('error', addServerInfo(serverInfo, onError));
  server.on('listening', addServerInfo(serverInfo, onListening));
  // Listen on provided port, on all network interfaces.
  server.listen(port);
}

function onClusterOnline(worker: cluster.Worker) {
  logger.info(`Worker PID: ${worker.process.pid} is online`);
}

function onClusterExit(deadWorker: cluster.Worker, code: number, signal: string) {

  const worker = cluster.fork();
  // Note the process IDs
  const newPID = worker.process.pid;
  const oldPID = deadWorker.process.pid;

  // Log the event
  logger.warn('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  logger.warn(`worker ${oldPID} died, ${deadWorker && deadWorker.id}`);
  logger.warn(`worker ${newPID} born, ${worker && worker.id}`);
  logger.warn(`code: ${code} signal: ${signal}`);
  logger.warn('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  return worker;
}

/**
 * Event listener for HTTP server 'error' event.
 */
function onError(serverInfo: ServerInfo, error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof serverInfo.port === 'string'
    ? `Pipe ${serverInfo.port}`
    : `Port ${serverInfo.port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind, ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind, ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening(serverInfo: ServerInfo) {
  const addr = serverInfo.server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  logger.info(`Server listening on ${bind}`);
}

interface ServerInfo {
  server: http.Server;
  port: number;
}
