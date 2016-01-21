'use strict';

const httpServe = require('./modules/http/httpServe');
const fetch = require('./modules/tweets/fetch');
const storage = require('./modules/tweets/storage');
const sockets = new Set();
const port = 4000;

httpServe.app.listen(port, () => {

  console.info(`[${new Date().toISOString().slice(0, 19)}]Api Server listen on ${port}`);

  storage.cronTask();

  fetch( (tweet) => {

    console.info(`[${new Date().toISOString().slice(0, 19)}]New tweet: ${JSON.stringify(tweet)}`);

    storage.data.add(tweet);

    for(const socket of sockets){

      socket.emit('tweet', tweet);

    }

  });

  httpServe.io.on('connection', (socket) => {

    sockets.add(socket);

    socket.on('disconnect', () => {

      sockets.delete(socket);

    });

    socket.on('getTweetsHistorique', () => {

      socket.emit('tweetsHistorique', Array.from(storage.data) );

    });

  });

});
