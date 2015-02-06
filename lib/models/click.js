module.exports = function (sequelize) {
  var Click = sequelize.define('Click', {}, {
    classMethods: {
      associate: function (models) {
        Click.belongsTo(models.Notification);
        Click.belongsTo(models.User);
      }
    }
  });

  return Click;
};
