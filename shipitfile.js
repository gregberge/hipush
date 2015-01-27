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
      branch: 'deploy',
      shallowClone: true
    },
    production: {
      servers: 'hipush.net'
    }
  });

  shipit.currentPath = path.join(shipit.config.deployTo, 'current');

  shipit.on('published', function () {
    shipit.start('remoteInstall');
  });

  shipit.blTask('remoteInstall', function () {
    return shipit.remote('cd ' + shipit.currentPath + ' && npm i --production');
  });

  shipit.blTask('restart', function () {
    return shipit.remote(
      'service hipush restart'
    );
  });
};