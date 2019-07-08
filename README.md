# egg-models-export

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-models-export.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-models-export
[travis-image]: https://img.shields.io/travis/eggjs/egg-models-export.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-models-export
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-models-export.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-models-export?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-models-export.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-models-export
[snyk-image]: https://snyk.io/test/npm/egg-models-export/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-models-export
[download-image]: https://img.shields.io/npm/dm/egg-models-export.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-models-export

<!--
Description here.
-->

## 使用场景

1. 很多时候我们的项目是这样的，根据数据库生成数据模型 `Model` ，业务部分 `Services` 通过访问数据模型 `Model` 来进行业务数据交互。
![](https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/bho/egg-models-xxx%2001.jpg)

2. 在有些情况下，项目结构也许是这个样子的：由于终端可能不同，项目也可能不同，但数据模型部分却是一致的。A、B、C三个项目公用一个数据库，也很正常。

![](https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/bho/egg-models-xxx%2002.jpg)

- 此时，项目组之间就会出现这样的问题：一旦数据模型变更，所需变更改动的地方就是**所涉及的项目总数**。

## 插件设计理念
- 本插件是 ~~为了防止世界被破坏~~，为了减少功能变动或设计变动所导致的 `Model` 部分多次改动(人工改动必然会增加错误率)，为了降低项目结构的耦合。

## 插件运行流程
- 将数据模型文件部分做为独立项目运行，其他**关联项目**在启动时，异步访问**数据模型项目**，根据解析结果生成虚拟**sequelize models**。
![](https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/bho/egg-models-xxx%2003.jpg)

- 插件分为两部分：`egg-models-import` 和 `egg-models-export`。顾名思义，前者是**导入**行为，**关联项目**所需使用的，用于异步加载并生成数据模型缓存；后者是**导出**行为，**数据模型项目**所需的，用于对外提供远程接口，根据真实的数据模型，为**关联项目**提供模型解析方案。

## egg-models-import 配置
请到 [egg-models-import](https://github.com/Alalabu/egg-models-import) 查看详细配置项说明。

## egg-models-export 配置

### 依赖的插件

- ~~egg-sequelize：`^4.3.1` (1.0.5前)~~
- egg-sequelize：`^5.1.0` (1.0.6+)
- mysql2：`^1.6.5`
- moment：`^2.24.0`

### 1. 安装

```bash
$ npm i egg-models-export --save
```

### 2. 开启插件

```js
// config/plugin.js
exports.modelsExport = {
  enable: true,
  package: 'egg-models-export',
};
```

### 3. 配置插件
```javascript
// config/config.{dev}.js
'use strict';

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_xxxxxxxx';

  // sequelize 配置即可
  config.sequelize = {
    // ...
  };

  return {
    ...config,
  };
};
```
### 4. 模型设置
- 在 `egg-models-export` 项目中需要编辑 `model` 文件，编辑模型属性及关联关系等，启动项目即可。
![](https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/bho/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20190705192841.png)

> 简单模式下（不需要使用鉴权及多数据库模式），配置到这一步即可。此时通过 `npm start` 启动**数据核心**项目，安装了 `egg-models-import` 插件的项目便可以接入缓存数据了。

### 5. 鉴权
> 1.0.5 新增： **数据模型核心**可以配置每个**分支项目**的访问权限，及可访问的 `table` 组。

```javascript
// config/config.{dev}.js
'use strict';

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  config.modelsExport = {
	// auth 默认为空，如果配置，则表明核心对外部访问需要鉴权
    auth: [{
        key: 'project-1',
        secret: '7825dfc0-4c82-11e9-81c9-73dbcff02a31',
        ignore: [],
        contains: [ 'address', 'client' ],
      }, {
        key: 'project-2',
        secret: '68b5dfc0-4c82-11e9-81c9-73dbcff02bd1',
        ignore: [ 'client', 'province' ],
    },],
  };

  return {
    ...config,
  };
};
```
属性 | 类型 | 描述
---  | --- | --------
auth | Array<role> | [ 非必要，一旦配置则启用鉴权 ] 权限数组，每一个元素都表示一个访问角色
role | Object | 权限数组中的元素 (由项目设计者约定分配)
key | String | 访问角色的 KEY 
secret | String | 访问角色的 SECRET
ignore | Array<String> | [ 非必要 ] 忽略的数据表，配置的所有表将不会被访问者获取
contains | Array<String> | [ 非必要 ] 仅能访问的数据表，优先级大于 `ignore` ，若与 `ignore` 同时存在则仅仅 `contains` 有效。

### 6. 多库支持
> `1.0.6`版本：在特殊情况下，**数据核心**的管理者可能希望一个核心管理多个数据库，并为其他**分支项目**分配不同的数据模型支持。

#### 6.1 egg-sequelize 配置
通过配置 `datasources` 数组，可以为**数据核心**挂载多个数据库模型。
```javascript
// config/config.default.js
config.sequelize = {
  datasources: [
    {
      delegate: 'model_01', // load all models to app.model and ctx.model
      baseDir: 'model_01', // load models from `app/model/*.js`
      database: 'biz',
      // other sequelize configurations
    },
    {
      delegate: 'model_02', // load all models to app.adminModel and ctx.adminModel
      baseDir: 'model_02', // load models from `app/admin_model/*.js`
      database: 'admin',
      // other sequelize configurations
    },
  ],
};
```
#### 6.2 modelsExport 配置
多数据库状态下，必须配置 `auth` 鉴权，并且每一个**角色**都必须配置 `delegate` ，与 `sequelize` 中的 `delegate` 需一以应对。
```javascript
// config/config.default.js
config.modelsExport = {
  // auth 默认为空，如果配置，则表明核心对外部访问需要鉴权
  auth: [{
      key: 'project-1',
      secret: '7825dfc0-4c82-11e9-81c9-73dbcff02a31',
	  delegate: 'model_01', // 多库必须配置 delegate
      ignore: [],
      contains: [ 'address', 'client' ],
    }, {
      key: 'project-2',
      secret: '68b5dfc0-4c82-11e9-81c9-73dbcff02bd1',
	  delegate: 'model_02', // 多库必须配置 delegate
      ignore: [ 'client', 'province' ],
  },],
};
```
#### 6.3 多库数据模型
路径需与配置一一应对，将数据模型文件放置于相应的**模型路径**之中，即可分别动态加载。
![](https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/bho/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190708181541.png)

## 历史版本
> `1.0.6` ：
> 1. 新增 对**数据核心**多库的支持；
> 2. 变更 `egg-sequelize` 的支持版本从 `4.3.1` 到 `5.1.0`;
> 
> `1.0.5` ：
> 1. 新增 鉴权功能，通过配置鉴权数组，可限制访问者无法访问 `ignore`（忽略列表），或限制访问者只能访问 `contains`（仅可访问列表）;
> 2. 修复 其他问题;

## 提问交流

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。

