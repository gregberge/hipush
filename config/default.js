var path = require('path');

module.exports = {
  httpServer: {
    port: 8080
  },
  database: {
    name: 'hipush',
    user: process.env.HIPUSH_DATABASE_USER || 'hipush',
    password: process.env.HIPUSH_DATABASE_PASSWORD || null,
    hostname: process.env.HIPUSH_DATABASE_HOSTNAME || '192.168.59.103',
    port: process.env.HIPUSH_DATABASE_PORT || 5432
  },
  spn: {
    authTokenSalt: process.env.HIPUSH_SFP_AUTH_TOKEN_SALT,
    websitePushId: 'web.net.hipush',
    webServiceUrl: 'http://hipush.net/api/apple',
    packageDirectory: path.join(__dirname, '../storage/packages'),
    imageDirectory: path.join(__dirname, '../storage/images'),
    cert: path.join(__dirname, '../storage/spn/cert.pem'),
    key: path.join(__dirname, '../storage/spn/key.pem')
  },
  logger: {
    level: 'info'
  }
};
