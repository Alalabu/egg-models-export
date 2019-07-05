'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Dormitory = app.model.define('dormitory', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    drom_name: {
      type: DataTypes.STRING,
    },
    drom_num: {
      type: DataTypes.INTEGER,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'dormitory',
    timestamps: false,
  });

  return Dormitory;
};
