var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('db:sync', function () {
  var models = require('./lib/models');
  return models.sequelize.sync();
});

gulp.task('db:populate', ['db:sync'], function () {
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

gulp.task('browsersync', function() {
  browserSync({
    open: false,
    server: {
      baseDir: './'
    }
  });
});

gulp.task('default', ['browsersync']);
