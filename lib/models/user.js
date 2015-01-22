module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    domain: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        User.belongsTo(models.Website);
      }
    }
  });

  return User;
};
