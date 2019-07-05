'use strict';
const sequelize = require('sequelize');

const parseDataTypes = (typeVal) => {
  // console.log(`typeVal type -> ${typeVal}`);
  if( typeVal instanceof sequelize.STRING) return 'STRING';
  if( typeVal instanceof sequelize.INTEGER) return 'INTEGER';
  if( typeVal instanceof sequelize.DATE) return 'DATE';
  // if( typeVal instanceof sequelize.TIME) return 'TIME';
  if( typeVal instanceof sequelize.FLOAT) return 'FLOAT';
  if( typeVal instanceof sequelize.DOUBLE) return 'DOUBLE';
  if( typeVal.toString() === 'TIME') return 'TIME';
  // if( typeVal instanceof sequelize.BOOLEAN) return 'BOOLEAN';
}
/**
 * 加载模型表数据[列表]
 * @param {*} model 
 */
const loadModelTables = model => {
  if(!model) return console.error('PLUGIN [egg-model-export  loadModelTables ] ctx.model is undefined!');
  return Object.keys(model.models);
}
/**
 * 通过表数据, 加载模型属性[及关联关系]
 * @param {*} models 
 * @param {*} tableName 
 */
const loadModelAttributes = (model, tableName) => {
  if(!model) return console.error('PLUGIN [egg-model-export  loadModelAttributes ] ctx.model is undefined!');
  if(!tableName) return console.error('PLUGIN [egg-model-export  loadModelAttributes ] tableName is undefined!');
  const models = model.models;
  const target_model = models[tableName];
  const target_model_attrs = target_model['attributes'];
  // 整理关联关系
  const associations = [];
  if(target_model['associations']){
    Object.keys(target_model['associations']).forEach((assKey) => {
    // 获取一个关联实例
    const assEntryTemp = target_model['associations'][assKey];
    const assEntry = {
        foreignKey: assEntryTemp['foreignKey'],
        targetKey: assEntryTemp['targetKey'],
        as: assEntryTemp['as'],
        associationType: assEntryTemp['associationType'],
        associationAccessor: assEntryTemp['target'].tableName,
      };
      associations.push(assEntry);
    });
  }
  // 整理模型属性
  const target_model_res = Object.keys(target_model_attrs).map((attrKey) => {
    const attrValue = target_model_attrs[attrKey];
    const {primaryKey, type, defaultValue} = attrValue;
    return {
      name: attrKey,
      primaryKey,
      type: parseDataTypes(type),
      defaultValue: (type instanceof sequelize.DATE && typeof defaultValue === 'object')? 'NOW': defaultValue,
    };
  });

  return {
    associations,
    attrs: target_model_res,
  };
}

module.exports = options => {
  return async function modelsFilter(ctx, next) {
    /**
     * 在中间件中处理到达的 [用于获取model数据] 请求
     * 1. [model/in]: 用于获取当前模型中所有的数据表
     * 2. [model/attrs]: 根据每一张数据表(或可选),获取表属性<及关联关系>
     */
    const { url } = ctx.request;
    const { api } = ctx.app.config.modelsExport;
    console.log(`插件 [egg-models-export] 请求API: ${url}`);
    try {
      if(url === api.tables){
        const { model } = ctx;
        console.log('ctx -> model -> ', model);
        ctx.body = loadModelTables(model);
      }else if(url === api.attrs){
        const {tableName} = ctx.request.body;
        const { model } = ctx;
        ctx.body = loadModelAttributes(model, tableName);
      }else{
        next();
      }
    } catch (error) {
      return console.error('ERROR: ', error);
    }
    
  }
}