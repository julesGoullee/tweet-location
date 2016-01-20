'use strict';

const fs = require('fs');
const dataFilePath = './config/data.json';

/**
 * saveTweets cron tasj
 * @param {Set} tweets - set of tweet Object
 */
function saveTweets(tweets){

  setInterval( () => {

    const tweetsString = JSON.stringify({
      'tweets': Array.from(tweets)
    });

    fs.writeFile(dataFilePath, tweetsString, (err) => {
      
      if(err){
        
        return console.error(`[${new Date().toISOString().slice(0, 19)}]${err}`);
        
      }

      return console.info(`[${new Date().toISOString().slice(0, 19)}]File saved`);
      
    });
    
  }, 60 * 60 * 1000);
  
}

module.exports = saveTweets;
