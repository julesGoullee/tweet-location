'use strict';

const Twitter = require('twitter');
const account = require('../config/account.json');

const client = new Twitter(account);

const parisBoundingBox = {
  'sw': '2.23,48.82',
  'ne': '2.44,48.90'
};

let nbTweetWithoutCoordinates = 0;

module.exports = (cb) => {

  client.stream('statuses/filter', { 'locations': `${parisBoundingBox.sw},${parisBoundingBox.ne}` }, (stream) => {

    console.log(`Listen stream of tweet from location`);

    stream.on('data', (tweet) => {
      
      if(tweet && tweet.geo && tweet.geo.coordinates){
        
        console.log(tweet.text);
        cb(tweet);
        
      } else{
        
        nbTweetWithoutCoordinates += 1;
        console.info(`Tweet incomplete data nb ${nbTweetWithoutCoordinates}`);
        
      }

    });

    stream.on('error', (error) => {

      throw error;

    });

  });

};
