var expect = require('chai').expect;
var spnAuthToken = require('../../../lib/services/spn-auth-token');

describe('Spn auth token', function () {
  it('should crypt and decrypt', function () {
    var crypted = spnAuthToken.crypt(20);
    var decrypted = spnAuthToken.decrypt(crypted);
    expect(decrypted).to.equal(20);
  });
});
