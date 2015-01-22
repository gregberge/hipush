var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('db:sync', function () {
  var models = require('./lib/models');
  return models.sequelize.sync()
  .then(function () {
    return models.sequelize.close();
  });
});

gulp.task('test', function () {
  // Force test environment.
  process.env.NODE_ENV = 'test';

  return gulp.src('test/lib/**/*.js', {read: false})
  .pipe(mocha());
});
