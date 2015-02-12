var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var argv = require('minimist')(process.argv.slice(2));

// Force gulp to properly exit on error.
gulp.on('err', function (err) {
  throw err;
});

/**
 * Force gulp to properly exit at the end.
 */

function exitAtTheEnd() {
  gulp.on('stop', function () {
    process.exit(0);
  });
}


gulp.task('db:sync', function () {
  exitAtTheEnd();
  var models = require('./lib/models');
  return models.sequelize.sync();
});

gulp.task('db:drop', function () {
  exitAtTheEnd();
  var models = require('./lib/models');
  return models.sequelize.drop();
});

gulp.task('db:populate', ['db:sync'], function () {
  exitAtTheEnd();
  var Promise = require('bluebird');
  var models = require('./lib/models');

  return Promise.all([
    models.Customer.create({
      id: 1,
      email: 'berge.greg@gmail.com'
    }),
    models.Website.create({
      id: 1,
      name: 'Hipush',
      domain: 'http://hipush.net'
    })
  ])
  .spread(function (customer, website) {
    return website.setCustomer(customer);
  });
});

gulp.task('browsersync', ['server'], function() {
  var config = require('./lib/config');

  browserSync({
    proxy: 'localhost:' + config.httpServer.port,
    open: false
  });
});

gulp.task('server', function () {
  return nodemon({
    script: './bin/http',
    ext: 'html js'
  });
});

gulp.task('generatePushPackage', function () {
  var spnPushPackage = require('./lib/services/spn-push-package');

  var websiteId = argv['website-id'];

  if (!websiteId)
    throw new Error('--website-id required');

  return spnPushPackage.generateFromId(websiteId);
});

gulp.task('build', function() {
  return gulp.src('public/hp.src.js')
    .pipe(rename('hp.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

gulp.task('default', ['browsersync']);
