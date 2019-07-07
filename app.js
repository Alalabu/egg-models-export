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

  app.beforeStart(async () => {
    // 此处是你原来的逻辑代码
    console.log('app.beforeStart...');
    // app.test01 = 'test001';
  });
};
