var expect = require('chai').use(require('sinon-chai')).expect;
var request = require('supertest');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var sinon = require('sinon');
var app = require('../../../lib/http/routes');
var spnAuthToken = require('../../../lib/services/spn-auth-token');
var sendQueue = require('../../../lib/services/send-queue');
var config = require('../../../lib/config');
var models = require('../../../lib/models');

describe('Http server app', function () {
  describe('POST /api/apple/v1/pushPackages/web.net.hipush', function () {
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

  describe('POST /api/apple/v1/devices/:token/registrations/web.net.hipush', function () {
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

  describe('DELETE /api/apple/v1/devices/:token/registrations/web.net.hipush', function () {
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

  describe('POST /api/internal/websites/1/generate-push-package', function () {
    it('should generate package', function (done) {
      request(app)
      .post('/api/internal/websites/1/generate-push-package')
      .set('Authorization', 'Internal ' + config.internal.authSecret)
      .expect(200)
      .expect({error: false})
      .end(done);
    });
  });

  describe('POST /api/internal/websites/1/notifications', function () {
    beforeEach(function () {
      sinon.spy(sendQueue, 'push');
    });

    afterEach(function () {
      sendQueue.push.restore();
    });

    it('should create a notification and add it to the queue', function (done) {
      request(app)
      .post('/api/internal/websites/1/notifications')
      .set('Authorization', 'Internal ' + config.internal.authSecret)
      .send({
        title: 'My test notification',
        body: 'A good news',
        action: 'View',
        url: 'http://mywebsite.com/x/d'
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('title', 'My test notification');
        expect(res.body).to.have.property('body', 'A good news');
        expect(res.body).to.have.property('action', 'View');
        expect(res.body).to.have.property('url', 'http://mywebsite.com/x/d');
        expect(res.body).to.have.property('WebsiteId', 1);
        expect(sendQueue.push).to.be.calledWith({notificationId: res.body.id});
        done();
      });
    });
  });

  describe('GET /url', function () {
    it('should throw an error if url is not present', function (done) {
      request(app)
      .get('/url')
      .expect(500)
      .end(done);
    });

    it('should redirect to the url in query string', function (done) {
      request(app)
      .get('/url?url=http://google.com')
      .expect(302)
      .expect('Location', 'http://google.com')
      .end(done);
    });
  });
});
