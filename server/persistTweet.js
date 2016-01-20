'use strict';

const fs = require('fs');
const path = require('path');
const dataFilePath = './config/data.json';
const previewData = require(path.resolve(__dirname, '../', dataFilePath) );

/**
 * saveTweets cron tasj
 * @param {Set} tweets - set of tweet Object
 */
function saveTweets(tweets){

  const tweetsString = JSON.stringify({
    'tweets': Array.from(tweets)
  });

  fs.writeFile(dataFilePath, tweetsString, (err) => {

    if(err){

      return console.error(`[${new Date().toISOString().slice(0, 19)}]${err}`);

    }

    return console.info(`[${new Date().toISOString().slice(0, 19)}]File saved`);

  });


}


/**
 * launch interval task
 * @param {Set} tweets - set of tweet Object
 */
function cronTask(tweets){

  setInterval( () => {

    saveTweets(tweets);

  }, 60 * 60 * 1000);

}

module.exports = { cronTask, previewData };
