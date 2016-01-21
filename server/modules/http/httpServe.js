'use strict';

const http = require('http');
const socketIo = require('socket.io');

const predictionRoute = require('./predictionRoute');

/**
 * Request handler
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
function handler(req, res){
  
  predictionRoute(req, res);
  
}

const app = http.createServer(handler);

const io = socketIo.listen(app).sockets;

module.exports = { app, io };
