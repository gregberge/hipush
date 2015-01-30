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
    authTokenSalt: process.env.HIPUSH_SPN_AUTH_TOKEN_SALT,
    websitePushID: 'web.net.hipush',
    webServiceURL: 'https://hipush.net/api/apple',
    packageDirectory: path.join(__dirname, '../storage/packages'),
    imageDirectory: path.join(__dirname, '../storage/images'),
    cert: path.join(__dirname, '../storage/spn/cert.pem'),
    key: path.join(__dirname, '../storage/spn/key.pem'),
    keyPass: process.env.HIPUSH_SPN_KEY_PASSWORD
  },
  internal: {
    authSecret: process.env.HIPUSH_INTERNAL_AUTH_SECRET
  },
  logger: {
    name: 'hipush',
    level: 'info'
  }
};
