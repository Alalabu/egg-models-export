'use strict';

module.exports = () => {
  const config = {};
  config.keys = '123456';

  // 中间件的执行内容，顺序从前置后
  // config.middleware = [ 'modelsFilter' ];

  // config.modelsImport = {
  //   url: 'mysql://asdasdasd',
  // };

  // add sesquelize database connections config
  config.sequelize = {
    dialect: 'mysql',

    host: '127.0.0.1',
    port: 53306,
    database: 'yourdb',
    username: 'root',
    password: 'root',

    timezone: '+08:00',
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 20000,
      evict: 30000,
    },
    retry: { max: 3 },
    logging(sql) {
      // 数据库语句执行打印日志
      console.log('【SQL】 => ', sql);
    },
  };

  console.log('egg-models-export pulgin load...');
  return {
    ...config,
  };
};
