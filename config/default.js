module.exports = {
  database: {
    name: 'hipush',
    user: process.env.HIPUSH_DATABASE_USER || 'hipush',
    password: process.env.HIPUSH_DATABASE_PASSWORD || null,
    hostname: process.env.HIPUSH_DATABASE_HOSTNAME || '192.168.59.103',
    port: process.env.HIPUSH_DATABASE_PORT || 5432
  },
  spn: {
    authTokenSalt: process.env.HIPUSH_SFP_AUTH_TOKEN_SALT
  }
};
