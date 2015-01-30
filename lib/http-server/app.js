var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var bunyanRequest = require('bunyan-request');
var config = require('../config');
var spnPushPackage = require('../services/spn-push-package');
var logger = require('../logger');
var authSpn = require('./middlewares/auth-spn');
var authInternal = require('./middlewares/auth-internal');

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
  '/api/apple/v1/devices/:deviceToken/registrations/' + config.spn.websitePushId,
  authSpn(),
  function (req, res) {
    console.log('TOKEN REGISTRATION', req.websiteId, req.body);
    res.send(200);
  }
);

app.post('/api/apple/v1/pushPackages/' + config.spn.websitePushId, function (req, res) {
  var packagePath = spnPushPackage.getPath(req.body.websiteId);
  res.sendFile(packagePath, {
    maxAge: '60s',
    headers: {
      'Content-Type': 'application/zip'
    }
  });
});

app.post('/api/apple/v1/log', function (req, res, next) {
  logger.info('APPLE LOG', req.body);
  res.status(204).send();
});
