'use strict';

const fs = require('fs');
const path = require('path');
const dataFilePath = './server/data/data.json';
const previewData = require(path.resolve(__dirname, '../../../', dataFilePath) );
const data = new Set(previewData.tweets);

/**
 * saveTweets cron task
 */
function saveTweets(){

  const tweetsString = JSON.stringify({
    'tweets': Array.from(data)
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
 */
function cronTask(){

  setInterval( () => {

    saveTweets();

  }, 30 * 60 * 1000);

}

module.exports = { cronTask, data };
