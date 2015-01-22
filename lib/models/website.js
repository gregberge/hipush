module.exports = function (sequelize, DataTypes) {
  var Website = sequelize.define('Website', {
    name: DataTypes.STRING,
    domain: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Website.belongsTo(models.Customer);
      }
    }
  });

  return Website;
};
