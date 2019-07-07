'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const City = app.model.define('city', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    provincecode: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'city',
    timestamps: false,
  });

  return City;
};

