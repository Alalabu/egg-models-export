'use strict';

module.exports = app => {
  // 获取中间件组
  const coreMiddleware = app.config.coreMiddleware;
  // 获取 bodyParser 的位置
  const bodyParserIndex = coreMiddleware.indexOf('bodyParser');
  // 将中间件 modelsFilter 插入中间件组, bodyParser 之后一位
  coreMiddleware.splice((bodyParserIndex + 3), 0, 'modelsFilter');
  // coreMiddleware.push('modelsFilter');
  // 重新赋值中间件
  app.config.coreMiddleware = coreMiddleware;
};
