var _ = require('lodash');
var spnAuthToken = require('spn-auth-token');
var config = require('../config');

exports.crypt = _.partialRight(spnAuthToken.crypt, config.spn.authTokenSalt);
exports.decrypt = _.partialRight(spnAuthToken.decrypt, config.spn.authTokenSalt);
