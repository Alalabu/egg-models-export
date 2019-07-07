'use strict';
const moment = require('moment');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Client = app.model.define('client', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Client.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'client',
    timestamps: false,
  });

  return Client;
};

