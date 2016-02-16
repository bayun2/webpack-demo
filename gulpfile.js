'use strict';
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const open = require('open');
const express = require('express');
const gulp = require('gulp');
const path = require('path');
const del = require('del');
const env = require('gulp-env');
const request = require('request');
const objectAssign = require('object-assign');
const wpConfig = require('./webpack.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

gulp.task('clean', cb => del(['dist'], cb));

gulp.task('build', ['clean'], () => {
  let config = objectAssign({}, wpConfig, {
    devtool: 'source-map',
    plugins: [
      new ExtractTextPlugin('global.css'),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    ]
  });
  return gulp.src('./src/**/*.js')
    .pipe(env.set({
      NODE_ENV: 'production'
    }))
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest('dist'));
});

gulp.task('dev', cb => {
  env({
    NODE_ENV: 'development'
  });
  const app = express();
  let config = objectAssign({}, wpConfig, {
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin('global.css')
    ]
  });
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.get('/assets/js/modules/*', function(req, res) {
    res.redirect('/dist/index.js');
  });
  app.get('/lib/:name', function(req, res) {
    res.sendFile(path.join(__dirname, 'lib', req.params.name));
  });
  app.get('/pages/:name', function(req, res) {
    res.sendFile(path.join(__dirname, 'pages', req.params.name));
  });
  app.use(function(req, res, next) {
    var url = req.originalUrl;
    if (url.indexOf('/assets/js/modules') === 0) {

    } else if (url.indexOf('/lib') === 0) {

    } else if (url.indexOf('/pages') === 0) {

    } else {
      var options = {
        uri: 'http://60.191.30.125' + url,
        mothed: 'GET',
        headers: {
          Host: req.hostname,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-Cache'
        }
      };
      request(options, function(error, response, body) {
        if (!error) {
          return res.status(response.statusCode).send(response.body);
        }
      });
    }
  });

  app.listen(80, 'localhost', function(err) {
    if (err) {
      console.log(err);
      return;
    }
    //open('http://localhost:3000/pages/index.html');
    cb();
  });
});

gulp.task('default', ['build']);
