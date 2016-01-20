'use strict';

const socket = require('connector/connector.js');

const Map = require('map/map.js');

socket.on('connect', () => {
  
  const map = new Map();
  
  map.draw( () => {
    
    
    const parisCenter = {
      'lat': 48.8587725,
      'lng': 2.32004486840164
    };
    
    
    setTimeout( () => {
      
      map.drawPoints(parisCenter.lat, parisCenter.lng);
      
    }, 3000);
    
    socket.on('tweet', (tweet) => {
      
      map.drawPoints(tweet.geo.lat, tweet.geo.lng);
      
    });
    
    socket.on('tweetsHistorique', (tweets) => {
      
      for(const tweet of tweets){
        
        map.drawPoints(tweet.geo.lat, tweet.geo.lng);
        
      }
      
    });
    
  });
  
});
