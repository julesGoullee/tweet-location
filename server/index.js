'use strict';

const httpServe = require('./httpServe');
const getTweet = require('./getTweets');
const persistTweet = require('./persistTweet.js');
const port = 4000;
const sockets = new Set();
const tweets = new Set(persistTweet.previewData.tweets);

httpServe.app.listen(port, () => {
  
  console.info(`[${new Date().toISOString().slice(0, 19)}]Api Server listen on ${port}`);

  persistTweet.cronTask(tweets);
  
  
  getTweet( (tweetData) => {
    
    const tweet = {
      'geo': {
        'lat': tweetData.geo.coordinates[0],
        'lng': tweetData.geo.coordinates[1],
        'create_at': tweetData.created_at
      }
    };
    
    console.info(`[${new Date().toISOString().slice(0, 19)}]New tweet: ${JSON.stringify(tweet)}`);

    tweets.add(tweet);
    
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

      socket.emit('tweetsHistorique', Array.from(tweets) );

    });

  });
  
});
