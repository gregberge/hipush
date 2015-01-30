var path = require('path');

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/hipush',
      deployTo: '/opt/hipush',
      repositoryUrl: 'git@github.com:hipush/hipush.git',
      ignores: ['.*', 'test'],
      keepReleases: 5,
      branch: 'master',
      shallowClone: true
    },
    production: {
      servers: 'hipush.net'
    }
  });

  shipit.currentPath = path.join(shipit.config.deployTo, 'current');

  shipit.on('fetched', function () {
    shipit.start('localInstall');
  });

  shipit.on('updated', function () {
    shipit.start('remoteInstall');
  });

  shipit.on('published', function () {
    shipit.start('restart');
  });

  shipit.blTask('localInstall', function () {
    return shipit.local(
      'cd ' + shipit.config.workspace + ' && ' +
      'npm install --production');
  });

  shipit.blTask('remoteInstall', function () {
    return shipit.remote(
      'cd ' + shipit.releasePath + ' && ' +
      'npm rebuild'
    );
  });

  shipit.blTask('restart', function () {
    return shipit.remote('sudo service hipush restart');
  });
};
