'use strict';

const socket = require('connector/connector.js');

const Map = require('map/map.js');

socket.on('connect', () => {

  const map = new Map();

  map.draw( () => {

    socket.on('tweet', (tweet) => {

      map.drawPoints(tweet.geo.lat, tweet.geo.lng);

    });

    socket.on('tweetsHistorique', (tweets) => {

      for(const tweet of tweets){

        map.drawPoints(tweet.geo.lat, tweet.geo.lng);

      }

    });

    socket.emit('getTweetsHistorique');

  });

});
