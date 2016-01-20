'use strict';

const httpServe = require('./httpServe');

const getTweet = require('./getTweets');

const sockets = new Set();

const tweets = new Set();

httpServe.app.listen(3000, () => {
  
  console.log(`Api Server listen on 3000`);
  
  getTweet( (tweetData) => {
    
    const tweet = {
      'geo': {
        'lat': tweetData.geo.coordinates[0],
        'lng': tweetData.geo.coordinates[1],
        'create_at': tweetData.create_at
      }
    };
    
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
