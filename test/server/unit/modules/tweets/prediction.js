'use strict';

const path = require('path');
const testUtils = require('../../test.utils');
const storage = require(path.join(testUtils.serverPath, '/modules/tweets/storage.js') );
const Prediction = require(path.join(testUtils.serverPath, '/modules/tweets/prediction') );

describe('Prédiction', () => {
  

  it('Should return between 20% exact result for one point', () => {

    const tweet = {
      'create_at': 'Thu Jan 21 12:00:00 +0000 2016',
      'text': 'textT1',
      'geo': { 'lat': 48.85093785, 'lng': 2.32468745 }
    };

    storage.data.add(tweet);
    const time = Prediction.testGeo({ 'lat': 48.85093785, 'lng': 2.32468745 });

    expect(time.neural).to.to.be.within(0.40, 0.60);
    
  });
  
  afterEach( () => {

    storage.data.clear();

  });

});
