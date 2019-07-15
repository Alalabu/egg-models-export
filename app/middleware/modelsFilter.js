'use strict';
const sequelize = require('sequelize');

const parseDataTypes = typeVal => {
  if (typeVal.toString().indexOf('VARCHAR') === 0) return 'STRING';
  if (typeVal.toString() === 'INTEGER') return 'INTEGER';
  if (typeVal.toString() === 'DATETIME') return 'DATE';
  // if( typeVal instanceof sequelize.TIME) return 'TIME';
  if (typeVal.toString() === 'FLOAT') return 'FLOAT';
  if (typeVal.toString() === 'DOUBLE') return 'DOUBLE';
  if (typeVal.toString() === 'TIME') return 'TIME';
  // if( typeVal instanceof sequelize.BOOLEAN) return 'BOOLEAN';
};
/**
 * 加载模型表数据[列表]
 * @param {*} model
 */
const loadModelTables = (model, auth, dataVersion) => {
  if (!model) {
    console.error('PLUGIN [egg-model-export  loadModelTables ] ctx.model is undefined!');
    return { err: 'PLUGIN [egg-model-export  loadModelTables ] ctx.model is undefined!' };
  }
  /**
   * ignore: 忽略列表
   * contains: 仅包含列表, 优先级大于忽略列表, 代表有这个存在就会忽视忽略列表
   */
  const { ignore, contains } = auth || {};
  let modelKeys = Object.keys(model.models);

  if (contains && Array.isArray(contains) && contains.length > 0) {
    modelKeys = modelKeys.filter(k => contains.includes(k));
  } else if (ignore && Array.isArray(ignore) && ignore.length > 0) {
    modelKeys = modelKeys.filter(k => !ignore.includes(k));
  }
  // 返回数据库表的[键集合], 以及当前数据核心版本
  return { dataKeys: modelKeys, version: dataVersion };
};
/**
 * 通过表数据, 加载模型属性[及关联关系]
 * @param {*} model 模型对象
 * @param {*} tableName 表名
 */
const loadModelAttributes = (model, tableName, auth) => {
  if (!model) {
    console.error('PLUGIN [egg-model-export  loadModelAttributes ] ctx.model is undefined!');
    return { err: 'PLUGIN [egg-model-export  loadModelAttributes ] ctx.model is undefined!' };
  }
  if (!tableName) {
    console.error('PLUGIN [egg-model-export  loadModelAttributes ] tableName is undefined!');
    return { err: 'PLUGIN [egg-model-export  loadModelAttributes ] tableName is undefined!' };
  }
  /**
   * ignore: 忽略列表
   * contains: 仅包含列表, 优先级大于忽略列表, 代表有这个存在就会忽视忽略列表
   */
  const { ignore, contains } = auth || {};
  if (contains && Array.isArray(contains) && contains.length > 0 && !contains.includes(tableName)) {
    return { err: `${tableName} is not in auth contains.` };
  } else if (ignore && Array.isArray(ignore) && ignore.length > 0 && ignore.includes(tableName)) {
    return { err: `${tableName} is in auth ignore.` };
  }
  // 开始整理数据关系
  const models = model.models;
  const target_model = models[tableName];
  const target_model_attrs = target_model.attributes || target_model.tableAttributes;
  // 整理关联关系
  const associations = [];
  if (target_model.associations) {
    Object.keys(target_model.associations).forEach(assKey => {
    // 获取一个关联实例
      const assEntryTemp = target_model.associations[assKey];
      const assEntry = {
        foreignKey: assEntryTemp.foreignKey,
        targetKey: assEntryTemp.targetKey,
        as: assEntryTemp.as,
        associationType: assEntryTemp.associationType,
        associationAccessor: assEntryTemp.target.tableName,
      };
      associations.push(assEntry);
    });
  }
  // 整理模型属性
  const target_model_res = Object.keys(target_model_attrs).map(attrKey => {
    const attrValue = target_model_attrs[attrKey];
    const { primaryKey, type, defaultValue } = attrValue;
    return {
      name: attrKey,
      primaryKey,
      type: parseDataTypes(type),
      defaultValue: (type instanceof sequelize.DATE && typeof defaultValue === 'object') ? 'NOW' : defaultValue,
    };
  });

  return {
    associations,
    attrs: target_model_res,
  };
};

/**
 * 中间件
 */
module.exports = () => {
  // console.log('插件 [egg-models-export] 01 进入中间件加载...');
  return async function(ctx, next) {
    // console.log('插件 [egg-models-export] 02 进入中间件执行...', ctx.app);
    /**
     * 在中间件中处理到达的 [用于获取model数据] 请求
     * 1. [models/in]: 用于获取当前模型中所有的数据表
     * 2. [models/attrs]: 根据每一张数据表(或可选),获取表属性<及关联关系>
     */
    try {
      const { url } = ctx.request;
      // 鉴权部分的键 or 值
      const { authKey, authSecret } = ctx.request.body;
      /**
       * auth: Array 鉴权部分，如果有配置，则启用鉴权
       */
      const { api, auth, version } = ctx.app.config.modelsExport;
      // 如果配置中启用了 `auth` 则进行鉴权
      let currentAuth = null;
      let dataVersion = { code: 'fake version' }; // 数据核心版本
      if (auth && Array.isArray(auth)) {
        if (!authKey || !authSecret) {
          // eslint-disable-next-line no-return-assign
          return ctx.body = { err: '[egg-models-export] ERROR: key or secret not found!' };
        }
        // 权限获取
        for (const user of auth) {
          if (user.key === authKey && user.secret === authSecret) {
            // 获取权限组用户角色的热备版本
            dataVersion = user.version || dataVersion;
            currentAuth = {
              key: authKey, // 鉴权的key
              ignore: user.ignore, // 忽略列表
              contains: user.contains, // 仅可访问列表
              delegate: user.delegate, // 模型组位置
            };
            break;
          }
        }
        if (!currentAuth) {
          // eslint-disable-next-line no-return-assign
          return ctx.body = { err: '[egg-models-export] ERROR: You do not have permission to access this resource.' };
        }
      } else {
        // auth 配置无法检测,表示用户是为公开访问数据核心
        // 获取全局角色的热备版本
        dataVersion = version || dataVersion;
      }
      // delegate model dir name
      const delegate = currentAuth ? currentAuth.delegate || 'model' : 'model';
      // 解析 web api
      if (url === api.tables) {
        const model = ctx[delegate];
        ctx.body = loadModelTables(model, currentAuth, dataVersion);
      } else if (url === api.attrs) {
        const { tableName } = ctx.request.body;
        const model = ctx[delegate];
        ctx.body = loadModelAttributes(model, tableName, currentAuth);
      } else if (url === api.version) {
        // 获取当前数据热备版本(版本由用户自定义)
        // 仅仅告知 分支, 新的版本号, 以及更新时机
        ctx.body = dataVersion;
      } else {
        next();
      }
    } catch (error) {
      return console.error('ERROR: ', error);
    }

  };
};
