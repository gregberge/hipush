var apn = require('apn');
var Promise = require('bluebird');
var config = require('../config');
var logger = require('../logger').child({type: 'apn'});

exports.send = send;

var apnConnection = new apn.Connection({
  cert: config.spn.cert,
  key: config.spn.key,
  passphrase: config.spn.keyPass,
  production: true,
  autoAdjustCache: true
});

apnConnection.on('error', function (err) {
  logger.error('error', err);
});

apnConnection.on('socketError', function (err) {
  logger.error('socketError', err);
});

apnConnection.on('transmitted', function (notification, device) {
  logger.info('transmitted', notification, device);
});

apnConnection.on('completed', function () {
  logger.info('completed');
});

apnConnection.on('connected', function () {
  logger.info('connected');
});

apnConnection.on('disconnected', function () {
  logger.info('disconnected');
});

apnConnection.on('timeout', function () {
  logger.info('socket timeout');
});

apnConnection.on('cacheTooSmall', function (difference) {
  logger.warn('cacheTooSmall', difference);
});

apnConnection.on('transmissionError', function (errorCode, notification, device) {
  logger.error('transmissionError', errorCode, notification, device);
});

/**
 * Send a notification.
 *
 * @param {object} options options
 * @param {object} options.alert alert
 * @param {string[]} options.urlArgs Args
 * @param {string} options.token Token
 */

function send(options) {
  var notification = new apn.Notification();
  notification.alert = options.alert;
  notification.urlArgs = options.urlArgs;

  apnConnection.pushNotification(notification, options.token);
  return Promise.resolve();
}