'use strict';

const config = require('config');
const socket = require('socket.io-client')(config.api.host);

module.exports = socket;
