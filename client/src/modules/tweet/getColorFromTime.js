'use strict';

const pies = [
  {
    'color': '#FF0000', //red
    'time': 24 * 60 * 60 //00h00
  },
  {
    'color': '#48FF00', //green
    'time': 6 * 60 * 60 //06h00
  },
  {
    'color': '#0019FF', //blue
    'time': 18 * 60 * 60 //18h00
  }
];

/**
 * Return color switch tweet spawn
 * @param {Date} time - date of tweet
 * @return {String} colorString - Rgb string color
 */
function getColorFromTime(time){

  const timeInSec = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
  
  const colors = {
    'r': 0,
    'g': 0,
    'b': 0
  };
  
  if(timeInSec < pies[1].time){

    //night
    colors.g = 255 * timeInSec / pies[1].time;
    colors.r = 255 - colors.g;
    
  } else if(timeInSec < pies[2].time){

    //day
    colors.b = 255 * timeInSec / pies[2].time;
    colors.g = 255 - colors.b;
    
  } else{
    
    //evening
    colors.r = 255 * timeInSec / pies[0].time;
    colors.b = 255 - colors.r;
    
  }
  
  return `rgb(${parseInt(colors.r, 10)},${parseInt(colors.g, 10)},${parseInt(colors.b, 10)})`;
  
}

module.exports = getColorFromTime;
