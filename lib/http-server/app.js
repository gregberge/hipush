var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var config = require('../config');
var spnPushPackage = require('../services/spn-push-package');

var app = module.exports = express();

app.use(express.static(path.join(__dirname, '../../public')));

app.use(bodyParser.json());

app.post('/api/apple/v1/pushPackages/' + config.spn.websitePushId, function (req, res) {
  var packagePath = spnPushPackage.getPath(req.body.websiteId);
  res.sendFile(packagePath, {
    maxAge: '60s',
    headers: {
      'Content-Type': 'application/zip'
    }
  });
});
