var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var spnPushPackage = require('../../../lib/services/spn-push-package');
var models = require('../../../lib/models');

describe('Push package', function () {
  describe('#generate', function () {
    var packagePath;

    beforeEach(function () {
      packagePath = path.join(__dirname, '../../../storage/packages/1.zip');

      if (fs.existsSync(packagePath))
        fs.unlinkSync(packagePath);
    });

    it('should generate a push package', function () {
      return models.Website.find(1)
      .then(function (website) {
        return spnPushPackage.generate(website);
      })
      .then(function () {
        var stats = fs.statSync(packagePath);
        expect(stats.size).to.be.at.least(28000);
        expect(stats.size).to.be.at.most(29000);
      });
    });
  });
});
