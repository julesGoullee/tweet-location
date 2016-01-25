'use strict';

const connectors = require('connectors/connectors.js');

const Map = require('map/map.js');

connectors.realTime.on('connect', () => {

  const map = new Map();

  map.draw( () => {

    connectors.realTime.on('tweet', (tweet) => {

      map.drawPoint(tweet.geo.lat, tweet.geo.lng, new Date(tweet.create_at), tweet.text);

    });

    connectors.realTime.on('tweetsHistorique', (tweets) => {

      map.drawHistoriquePoints(tweets);
      map.onClickPrediction();

    });

    connectors.realTime.emit('getTweetsHistorique');

  });

});
