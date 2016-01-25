'use strict';

const Url = require('url');

const Prediction = require('../tweets/prediction');

/**
 * Check api params lat et lng TOD.O
 * @param {String} lat - req lat param
 * @param {String} lng - req lng param
 * @return {Boolean} isValid
 */
function checkGetAddressParams(lat, lng){
  
  return parseFloat(lat) == lat && parseFloat(lng) == lng; //eslint-disable-line
  
}

/**
 * Route for /geoPrediction?lat={Float}&lng={Float}
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @return on request end
 */
function PredictionHandler(req, res){
  
  req.url = Url.parse(req.url, '?');

  if(req.url.pathname !== '/geoPrediction'){
    
    res.writeHead(404);
    return res.end();

  }
  
  
  if(!checkGetAddressParams(req.url.query.lat, req.url.query.lng) ){

    res.writeHead(400);
    return res.end('Lat lng params incorrect');

  }
  
  const geoPrediction = { 'lat': req.url.query.lat, 'lng': req.url.query.lng };
  
  console.info(`New request prediction for:${JSON.stringify(geoPrediction)}`);

  const time = Prediction.testGeo(geoPrediction);
  
  const bodyRes = JSON.stringify({ 'time': time.string });
  
  res.writeHead(200, {
    'Content-length': bodyRes.length,
    'Access-Control-Allow-Origin': 'https://monchezmoi.codes',
    'Content-Type': 'application/json'
  });
  
  res.end(bodyRes);
  
}

module.exports = PredictionHandler;
