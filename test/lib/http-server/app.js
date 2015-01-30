var expect = require('chai').expect;
var request = require('supertest');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var app = require('../../../lib/http-server/app');
var spnAuthToken = require('../../../lib/services/spn-auth-token');
var config = require('../../../lib/config');

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
        expect(res.text).to.equal('zip file');
        done();
      });
    });
  });

  describe('POST device token', function () {
    var token;

    beforeEach(function () {
      token = spnAuthToken.encode({websiteId: 1});
    });

    it('should ..', function (done) {
      request(app)
      .post('/api/apple/v1/devices/my-beautiful-token/registrations/web.net.hipush')
      .set('Authorization', 'ApplePushNotifications ' + token)
      .end(done);
    });
  });

  describe('POST package generation', function () {
    it('should generate package', function (done) {
      request(app)
      .post('/api/internal/websites/1/generate-push-package')
      .set('Authorization', 'Internal ' + config.internal.authSecret)
      .expect(200)
      .expect({error: false})
      .end(done);
    });
  });
});
