var path = require('path');
var Promise = require('bluebird');
var argv = require('minimist')(process.argv.slice(2));

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/hipush',
      deployTo: '/opt/hipush',
      repositoryUrl: 'git@github.com:hipush/hipush.git',
      ignores: ['.*', 'test'],
      keepReleases: 5,
      branch: 'master'
    },
    http: {
      services: ['hipush-http'],
      servers: 'www.hipush.net'
    },
    workers: {
      services: ['hipush-send-worker', 'hipush-apn-worker'],
      servers: 'workers.hipush.net'
    }
  });

  shipit.currentPath = path.join(shipit.config.deployTo, 'current');

  shipit.on('fetched', function () {
    shipit.start('localInstall');

    if (shipit.config.services.indexOf('hipush-http') !== -1)
      shipit.start('build');
  });

  shipit.on('updated', function () {
    shipit.start('remoteInstall');
  });

  shipit.on('published', function () {
    shipit.start('restartServices');
  });

  shipit.blTask('localInstall', function () {
    return shipit.local(
      'cd ' + shipit.config.workspace + ' && ' +
      'npm install && ' +
      'gulp build && ' +
      'npm prune --production'
    );
  });

  shipit.blTask('remoteInstall', function () {
    return shipit.remote(
      'cd ' + shipit.releasePath + ' && ' +
      (argv.local ? 'npm rebuild' : 'npm i --production')
    );
  });

  shipit.blTask('restartServices', function () {
    return Promise.all(shipit.config.services.map(function (service) {
      return shipit.remote('sudo service ' + service + ' restart');
    }));
  });

  shipit.blTask('build', function () {
    return shipit.local('gulp build', {cwd: shipit.config.workspace});
  });
};
