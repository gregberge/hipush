module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Customer', {
    email: DataTypes.STRING
  });
};
