'use strict';

const config = require('config');

let geoCallStateInProgress = false;

/**
 * Get prediction by geo coordinates
 * @param {Number} lat - latitude point
 * @param {Number} lng - longitude point
 * @return {Promise} Resolve when response valid, reject on error or on concurrent call.
 */
function geo(lat, lng){

  return new Promise( (resolve, reject) => {

    if(geoCallStateInProgress){

      return reject('Other call in progress');

    }

    geoCallStateInProgress = true;

    fetch(`//${config.api.host}/geoPrediction?lat=${lat}&lng=${lng}`).then( (res) => {

      if(res.status !== 200){

        console.error(res);
        reject('Api error');

      }

      return res.json();

    }).then( (resJson) => {

      geoCallStateInProgress = false;

      resolve(resJson.time);

    });

  });

}

module.exports = { geo };
