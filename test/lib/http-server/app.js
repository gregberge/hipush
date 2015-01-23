var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../../lib/http-server/app');

describe('Http server app', function () {
  describe('GET apn package', function () {
    it('should return the zip', function (done) {
      request(app)
      .post('/api/apple/v1/pushPackages/web.net.hipush')
      .send({websiteId: 1})
      .expect('Content-Type', 'application/zip')
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).to.length.at.least(20000);
        done();
      });
    });
  });
});
