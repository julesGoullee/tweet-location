'use strict';

const GoogleMapsLoader = require('google-maps'); // only for common js environments

GoogleMapsLoader.KEY = 'AIzaSyBK72So3KURSZ1SjDXdLp-5LqJp3E0CFrc';

const parisCenter = {
  'lat': 48.8587725,
  'lng': 2.32004486840164
};

const mapsNode = document.getElementById('map');

/**
 * Google Maps représentation, draw points.
 */
function Maps(){
  
  let google = null;
  let gMap = null;
  
  this.draw = (cb) => {
    
    GoogleMapsLoader.load( (Google) => {

      google = Google;

      const gMapsOpt = {
        'zoom': 13,
        'center': new google.maps.LatLng(parisCenter.lat, parisCenter.lng),
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
  
  this.drawPoints = (lat, lng) => {
    
    const tweetPoint = new google.maps.Circle({
      'strokeColor': '#FF0000',
      'strokeOpacity': 0.8,
      'strokeWeight': 2,
      'fillColor': '#FF0000',
      'fillOpacity': 0.35,
      'map': gMap,
      'center': { 'lat': lat, 'lng': lng },
      'radius': 5
    });
    
  };
  
}

module.exports = Maps;
