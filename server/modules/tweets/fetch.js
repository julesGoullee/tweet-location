'use strict';

const Twitter = require('twitter');
const account = require('../../../config/account.json');

const client = new Twitter(account);

const parisBoundingBox = {
  'sw': '2.23,48.82',
  'ne': '2.44,48.90'
};

let nbTweetWithoutCoordinates = 0;

module.exports = (cb) => {

  client.stream('statuses/filter', { 'locations': `${parisBoundingBox.sw},${parisBoundingBox.ne}` }, (stream) => {

    console.info(`[${new Date().toISOString().slice(0, 19)}]Listen stream of tweet from location`);

    stream.on('data', (tweet) => {

      if(tweet && tweet.geo && tweet.geo.coordinates && tweet.text){

        const tweetClean = {
          'create_at': tweet.created_at,
          'text': tweet.text,
          'geo': {
            'lat': tweet.geo.coordinates[0],
            'lng': tweet.geo.coordinates[1]
          }
        };

        cb(tweetClean);

      } else{

        nbTweetWithoutCoordinates += 1;

        if(nbTweetWithoutCoordinates % 100 === 0){

          console.info(`[${new Date().toISOString().slice(0, 19)}]Tweet incomplete coordinates ${nbTweetWithoutCoordinates}`);

        }

      }

    });

    stream.on('error', (error) => {

      throw error;

    });

  });

};
