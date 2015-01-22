module.exports = function (sequelize, DataTypes) {
  var Customer = sequelize.define('Customer', {
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Customer.hasMany(models.Website);
      }
    }
  });

  return Customer;
};
