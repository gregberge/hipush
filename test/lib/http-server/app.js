var expect = require('chai').expect;
var request = require('supertest');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var app = require('../../../lib/http-server/app');
var spnAuthToken = require('../../../lib/services/spn-auth-token');
var config = require('../../../lib/config');
var models = require('../../../lib/models');

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

    beforeEach(function () {
      return models.User.find({where: {token: 'my-beautiful-token'}})
      .then(function (user) {
        if (user)
          return user.destroy();
      });
    });

    it('should add a new user', function (done) {
      request(app)
      .post('/api/apple/v1/devices/my-beautiful-token/registrations/web.net.hipush')
      .set('Authorization', 'ApplePushNotifications ' + token)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        models.User.find({where: {token: 'my-beautiful-token'}})
        .then(function (user) {
          expect(user).to.have.property('WebsiteId', 1);
          expect(user).to.have.property('token', 'my-beautiful-token');
        })
        .nodeify(done);
      });
    });
  });

  describe('DELETE device token', function () {
    var token;

    beforeEach(function () {
      token = spnAuthToken.encode({websiteId: 1});
    });

    beforeEach(function () {
      return models.User.findOrCreate({where: {token: 'my-beautiful-token'}});
    });

    it('should add a new user', function (done) {
      request(app)
      .delete('/api/apple/v1/devices/my-beautiful-token/registrations/web.net.hipush')
      .set('Authorization', 'ApplePushNotifications ' + token)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        models.User.find({where: {token: 'my-beautiful-token'}})
        .then(function (user) {
          expect(user).to.be.null;
        })
        .nodeify(done);
      });
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
