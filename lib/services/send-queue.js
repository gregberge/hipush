var sqs = require('ya-sqs');
var config = require('../config');

module.exports = sqs.createQueue({
  aws: config.aws,
  name: config.sendQueue.name
});
