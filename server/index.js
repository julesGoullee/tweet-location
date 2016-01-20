'use strict';

const httpServe = require('./httpServe');
const getTweet = require('./getTweets');

const port = 4000;
const sockets = new Set();
const tweets = new Set();

httpServe.app.listen(port, () => {
  
  console.info(`[${new Date().toISOString().slice(0, 19)}]Api Server listen on ${port}`);
  
  getTweet( (tweetData) => {
    
    const tweet = {
      'geo': {
        'lat': tweetData.geo.coordinates[0],
        'lng': tweetData.geo.coordinates[1],
        'create_at': tweetData.create_at
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
    
    socket.emit('tweetsHistorique', Array.from(tweets) );
    
  });
  
});
