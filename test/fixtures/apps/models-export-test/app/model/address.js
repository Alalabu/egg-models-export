'use strict';
const moment = require('moment');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Address = app.model.define('address', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    floor: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    is_default: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Address.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'address',
    timestamps: false,
  });

  Address.associate = () => {
    Address.belongsTo(app.model.School, { foreignKey: 'school_id', targetKey: 'sid' });
  };

  return Address;
};
