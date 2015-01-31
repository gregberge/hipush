module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    token: DataTypes.STRING,
    info: DataTypes.JSON
  }, {
    classMethods: {
      associate: function (models) {
        User.belongsTo(models.Website);
      }
    }
  });

  return User;
};
