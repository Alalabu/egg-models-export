'use strict';

module.exports = app => {
  // 在中间件最前面统计请求时间
  // console.log('app.config.coreMiddleware -------> ', app.config.coreMiddleware);
  const coreMiddleware = app.config.coreMiddleware;
  const bodyParserIndex = coreMiddleware.indexOf('bodyParser');
  coreMiddleware.splice((bodyParserIndex + 1), 0, 'modelsFilter');
  // console.log('coreMiddleware --> ', coreMiddleware);
  app.config.coreMiddleware = coreMiddleware;
  // app.config.coreMiddleware.unshift('modelsFilter');
};
