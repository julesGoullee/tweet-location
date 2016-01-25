'use strict';

const GoogleMapsLoader = require('google-maps'); // only for common js environments

const config = require('config');
const getColorFromTime = require('tweet/getColorFromTime.js');
const connectors = require('connectors/connectors.js');

GoogleMapsLoader.KEY = config.map.gMapsKey;

const mapsNode = document.getElementById('map');

/**
 * Google Maps représentation, draw points.
 */
function Maps(){

  let google = null;
  let gMap = null;

  /**
   * Draw - create gmaps
   * @param {Function} cb - callback on google maps created
   */
  this.draw = (cb) => {

    GoogleMapsLoader.load( (Google) => {

      google = Google;

      const gMapsOpt = {
        'zoom': 13,
        'center': new google.maps.LatLng(config.map.center.lat, config.map.center.lng),
        'mapTypeId': google.maps.MapTypeId.ROADMAP,
        'zoomControl': true,
        'mapTypeControl': false,
        'scaleControl': false,
        'streetViewControl': false,
        'rotateControl': false
      };

      gMap = new google.maps.Map(mapsNode, gMapsOpt);
      cb();

    });

  };

  /**
   * drawHistoriquePoints - creates existing tweet points
   * @param {Array} tweets list of tweets
   */
  this.drawHistoriquePoints = (tweets) => {

    const size = tweets.length;

    const drawLatencePoint = (i) => {

      setTimeout( () => {

        const tweet = tweets[i];

        this.drawPoint(tweet.geo.lat, tweet.geo.lng, new Date(tweet.create_at), tweet.text);

      }, i * 10);

    };

    for(let i = 0; i < size; i++){

      drawLatencePoint(i);

    }

  };

  /**
   * drawPoint - create one tweet point
   * @param {Number} lat - latitude tweet
   * @param {Number} lng - longitude tweet
   * @param {Date} date - tweet date
   * @param {String} text - twee content
   * @return {Object} tweetPoint - gmaps point
   */
  this.drawPoint = (lat, lng, date, text) => {

    const stringHours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const stringMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const stringSeconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    const stringDate = `${stringHours}h:${stringMinutes}m:${stringSeconds}s`;

    const color = getColorFromTime(date);
    const tweetPoint = new google.maps.Circle({
      'strokeColor': color,
      'strokeOpacity': 0.8,
      'strokeWeight': 2,
      'fillColor': color,
      'fillOpacity': 0.35,
      'map': gMap,
      'center': { 'lat': lat, 'lng': lng },
      'radius': 30
    });

    const infowindow = new google.maps.InfoWindow({
      'content': `${stringDate}\n${text}`
    });

    tweetPoint.addListener('click', () => {

      infowindow.setPosition({ 'lat': lat, 'lng': lng });
      infowindow.open(gMap);

    });

    return tweetPoint;

  };

  /**
   * On click map for prediction at this point
   */
  this.onClickPrediction = () => {

    gMap.addListener('click', (event) => {
      
      const circle = new google.maps.Circle({
        'strokeColor': '#FF7E00',
        'strokeOpacity': 0.8,
        'strokeWeight': 2,
        'fillColor': '#FF7E00',
        'fillOpacity': 0.35,
        'map': gMap,
        'radius': 120,
        'center': event.latLng
      });
      
      const infoWindow = new google.maps.InfoWindow({
        'position': event.latLng
      });

      infoWindow.setContent('Wait api works...');

      infoWindow.open(gMap);

      infoWindow.addListener('closeclick', () => {

        circle.setMap(null);

      });

      const jsonGeo = event.latLng.toJSON();

      connectors.prediction.geo(jsonGeo.lat, jsonGeo.lng).then( (time) => {

        infoWindow.setContent(time);

      }, (err) => {

        infoWindow.setContent(err);

      });

    });
    
  };
  
}

module.exports = Maps;
