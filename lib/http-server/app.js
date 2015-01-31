var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var bunyanRequest = require('bunyan-request');
var Promise = require('bluebird');
var config = require('../config');
var spnPushPackage = require('../services/spn-push-package');
var logger = require('../logger');
var authSpn = require('./middlewares/auth-spn');
var authInternal = require('./middlewares/auth-internal');
var models = require('../models');

var app = module.exports = express();

app.use(bunyanRequest({
  logger: logger
}));

app.use(express.static(path.join(__dirname, '../../public'), {maxAge: 0}));

app.use(bodyParser.json());

app.post(
  '/api/internal/websites/:websiteId/generate-push-package',
  authInternal(),
  function (req, res, next) {
    return spnPushPackage.generateFromId(req.params.websiteId)
    .then(function () {
      res.status(200).send({
        error: false
      });
    })
    .nodeify(next);
  }
);

app.post(
  '/api/apple/v1/devices/:deviceToken/registrations/' + config.spn.websitePushID,
  authSpn(),
  function (req, res, next) {
    models.User.findOrCreate({
      where: {token: req.params.deviceToken},
      defaults: {
        WebsiteId: req.websiteId
      }
    })
    .then(function () {
      res.sendStatus(200);
    })
    .nodeify(next);
  }
);

app.delete(
  '/api/apple/v1/devices/:deviceToken/registrations/' + config.spn.websitePushID,
  authSpn(),
  function (req, res, next) {
    models.User.destroy({
      where: {token: req.params.deviceToken}
    })
    .then(function () {
      res.sendStatus(200);
    })
    .nodeify(next);
  }
);

app.post(
  '/api/apple/v1/devices/:deviceToken/registrations/' + config.spn.websitePushID,
  authSpn(),
  function (req, res, next) {
    models.User.create({
      token: req.params.deviceToken,
      WebsiteId: req.websiteId
    })
    .then(function () {
      res.sendStatus(200);
    })
    .nodeify(next);
  }
);

app.post('/api/apple/v1/pushPackages/' + config.spn.websitePushID, function (req, res) {
  var packagePath = spnPushPackage.getPath(req.body.websiteId);
  res.sendFile(packagePath, {
    headers: {
      'Content-Type': 'application/zip'
    }
  });
});

app.post('/api/apple/v1/log', function (req, res) {
  logger.warn('Apple log', req.body);
  res.sendStatus(204);
});
