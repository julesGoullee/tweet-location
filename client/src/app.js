'use strict';

const socket = require('connector/connector.js');

const Map = require('map/map.js');

socket.on('connect', () => {

  const map = new Map();

  map.draw( () => {

    socket.on('tweet', (tweet) => {

      map.drawPoint(tweet.geo.lat, tweet.geo.lng, new Date(tweet.create_at), tweet.text);

    });

    socket.on('tweetsHistorique', (tweets) => {

      map.drawHistoriquePoints(tweets);
      map.onClickPrediction();
      
    });

    socket.emit('getTweetsHistorique');

  });

});
