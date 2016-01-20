'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const webpack = require('webpack');
const merge = require('merge-stream');
const production = process.argv.indexOf('--production') > -1;

const paths = {
  'dist': 'client/dist',
  'index': 'client/index.html',
  'webpack': {
    'rootDir': ['./client/src/modules', './client/src/config', './node_modules']
  },
  'css': 'client/css/app.css'
};

gulp.task('static', () => {
  
  return merge(
    gulp.src(paths.css)
      .pipe(gulp.dest(`${paths.dist}/css`) ),

    gulp.src(paths.index)
      .pipe(gulp.dest(paths.dist) )
  );
  
});
gulp.task('webpack', (cb) => {
  
  webpack({
    'entry': {
      'index': [
        './client/src/app.js'
      ]
    },
    'output': {
      'path': paths.dist,
      'filename': 'scripts/bundle.js',
      'publicPath': './client/src/modules'
    },
    'resolve': {
      'modulesDirectories': paths.webpack.rootDir,
      'extensions': ['', '.js', '.json']
    },
    'module': {
      'loaders': [
        { 'test': /src\/.*\.js$/, 'loader': 'babel?presets[]=es2015,cacheDirectory' }
      ]
    },
    'plugins': [
      new webpack.optimize.DedupePlugin()
    ].concat(production ? [
      new webpack.optimize.UglifyJsPlugin({
        'compress': {
          'warnings': false
        }
      })] : [])

  }, (err) => {
    
    if(err){
      
      throw new $.util.PluginError('webpack', err);
      
    }
    
    cb();
    
  });
  
});

gulp.task('build', ['static', 'webpack']);

gulp.task('dev-front-w', ['build'], () => {
  
  gulp.watch([
    'client/src/**/*.js'
  ], ['build']);

});

gulp.task('default', ['dev-front-w']);
