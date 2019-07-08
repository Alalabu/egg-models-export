'use strict';

module.exports = app => {
  // 在中间件最前面统计请求时间
  const coreMiddleware = app.config.coreMiddleware;
  const bodyParserIndex = coreMiddleware.indexOf('bodyParser');
  coreMiddleware.splice((bodyParserIndex + 1), 0, 'modelsFilter');
  app.config.coreMiddleware = coreMiddleware;
};
