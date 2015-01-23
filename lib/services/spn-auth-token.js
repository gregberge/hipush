var spnAuthToken = require('spn-auth-token');
var config = require('../config');

// Expose methods.
exports.crypt = crypt;
exports.decrypt = decrypt;

/**
 * Crypt an id into a token.
 *
 * @param {number} id
 * @returns {string} token
 */

function crypt(id) {
  return spnAuthToken.crypt(id + '', config.spn.authTokenSalt);
}

/**
 * Decrypt token into an id.
 *
 * @param {string} token
 * @returns {number} id
 */

function decrypt(token) {
  return +spnAuthToken.decrypt(token, config.spn.authTokenSalt);
}
