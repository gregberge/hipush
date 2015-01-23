var fs = require('fs');
var path = require('path');
var spnPushPackage = require('spn-push-package');
var spnAuthToken = require('./spn-auth-token');
var config = require('../config');
var Promise = require('bluebird');
var mkdirp = Promise.promisify(require('mkdirp'));

// Expose methods.
exports.generate = generate;

/**
 * Generate a push package.
 *
 * @param {Website} website
 * @returns {stream.Readable}
 */

function generate(website) {
  var imagePath = path.join(config.spn.imageDirectory, website.id + '.png');
  var zipPath = path.join(config.spn.packageDirectory, website.id + '.zip');

  return mkdirp(path.dirname(zipPath))
  .then(function () {
    return new Promise(function (resolve) {
      var iconset = spnPushPackage.generateIconSet(imagePath);

      var zipStream = spnPushPackage.generate({
        websiteJSON: {
          websiteName: website.name,
          websitePushId: config.spn.websitePushId,
          allowedDomains: [website.domain],
          urlFormatString: '%s',
          authenticationToken: spnAuthToken.crypt(website.id),
          webServiceUrl: config.spn.webServiceUrl
        },
        iconset: iconset,
        key: config.spn.key,
        cert: config.spn.cert
      });

      var writeStream = fs.createWriteStream(zipPath);

      zipStream.pipe(writeStream);

      writeStream.on('close', resolve);
    });
  });
}
