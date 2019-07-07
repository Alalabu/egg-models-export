'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const School = app.model.define('school', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    uName: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.STRING,
    },
    lng: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    district: {
      type: DataTypes.STRING,
    },
    province_code: {
      type: DataTypes.STRING,
    },
    city_code: {
      type: DataTypes.STRING,
    },
    district_code: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'school',
    timestamps: false,
  });

  return School;
};

