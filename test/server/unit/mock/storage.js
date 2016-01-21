'use strict';

const mock = require('mock-require');
const testUtils = require('../test.utils');
const path = require('path');

const mockedStorage = {};

mockedStorage.cronTask = () => {

  console.info('Mock cronTask called');

};

mockedStorage.data = new Set();

mock(path.join(testUtils.serverPath, '/modules/tweets/storage.js'), mockedStorage);
