var expect = require('chai').expect;
var request = require('supertest');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var app = require('../../../lib/http-server/app');

describe('Http server app', function () {
  describe('GET apn package', function () {
    beforeEach(function () {
      var packagePath = path.join(__dirname, '../../../storage/packages/123.zip');
      mkdirp.sync(path.dirname(packagePath));
      fs.writeFileSync(packagePath, 'zip file');
    });

    it('should return the zip', function (done) {
      request(app)
      .post('/api/apple/v1/pushPackages/web.net.hipush')
      .send({websiteId: 123})
      .expect('Content-Type', 'application/zip')
      .end(function (err, res) {
        if (err) return done(err);
        console.log(res.text);
        expect(res.text).to.equal('zip file');
        done();
      });
    });
  });
});
