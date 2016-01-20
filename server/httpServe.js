'use strict';

const http = require('http');
const socketIo = require('socket.io');


/**
 * Request handler
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
function handler(req, res){

  console.log(`New request`);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('ok');

}

const app = http.createServer(handler);

const io = socketIo.listen(app).sockets;

module.exports = { app, io };
