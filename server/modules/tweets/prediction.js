'use strict';

const brain = require('brain');

const trainOption = {
  'errorThresh': 0.005,  // error threshold to reach
  'iterations': 20000,   // maximum training iterations
  'log': false,          // console.log() progress periodically
  'logPeriod': 10,       // number of iterations between logging
  'learningRate': 0.3    // learning rate
};

const tweets = require('./storage').data;
const oneDayInSec = 24 * 60 * 60;
const boundingBox = {
  'lat': {
    'min': 48.82,
    'max': 48.90
  },
  'lng': {
    'min': 2.23,
    'max': 2.44
  }
};

/**
 * Neural time to string time
 * @param {Number} neuralTimeResult - neural time
 * @return {String}
 */
function stringTime(neuralTimeResult){
  
  const neuralVal = oneDayInSec * neuralTimeResult.toFixed(3);
  const h = (neuralVal - neuralVal % (60 * 60)) / (60 * 60); //eslint-disable-line
  const m = (neuralVal - h * 60 * 60 - neuralVal % 60) / 60;
  const s = neuralVal - h * 60 * 60 - m * 60;
  
  return `${h}h ${m}m ${Math.round(s)}s`;

}

/**
 * String isoString to neural isoString
 * @param {String} isoString - iso string date
 * @return {Number}
 */
function neuralTime(isoString){
  
  const dateTime = new Date(isoString);
  const timeInSec = dateTime.getHours() * 60 * 60 + dateTime.getMinutes() * 60 + dateTime.getSeconds();
  
  return timeInSec / oneDayInSec;
  
}

/**
 * Geo coordinate to neural coordinate
 * @param {Object} geo - geo object {lat, lng}
 * @return {Object} geo - neural position
 */
function neuralGeo(geo){
  
  return {
    'lat': (geo.lat - boundingBox.lat.min) / (boundingBox.lat.max - boundingBox.lat.min),
    'lng': (geo.lng - boundingBox.lng.min) / (boundingBox.lng.max - boundingBox.lng.min)
  };
  
}

/**
 * Transform tweet to Neural entry
 * @return {Object} tweetNeuralNetworkFormat
 */
function storageTweetToNeural(){

  console.log(`Nb entries storage: ${tweets.size}`);

  return Array.from(tweets).map( (tweet) => {
    
    return {
      'input': neuralGeo(tweet.geo),
      'output': {
        'time': neuralTime(tweet.create_at)
      }
    };

  });

}

/**
 * Prediction probability new tweet switch coordinate
 * @param {Object} geo - geo object {lat, lng}
 * @return {String} Hours - more probability hours new tweets in this coordinate
 */
function testGeo(geo){

  const net = new brain.NeuralNetwork();
  const neuralTweets = storageTweetToNeural();
  
  //console.log(`
  //  Net: ${JSON.stringify(neuralTweets)}
  //`);
  
  net.train(neuralTweets, trainOption);

  const netPosition = neuralGeo(geo);
  
  //console.log(`
  //  Test: ${JSON.stringify(netPosition)}
  //`);

  const neuralResult = net.run(netPosition).time;
  
  //console.log(`
  //  neuralResult: ${neuralResult}
  //`);

  return {
    'neural': neuralResult,
    'string': stringTime(neuralResult)
  };

}

storageTweetToNeural();

module.exports = { testGeo };
