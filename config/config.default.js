'use strict';

/**
 * egg-models-export default config
 * @member Config#modelsExport
 * @property {String} SOME_KEY - some description
 */
exports.modelsExport = {
  api: {
    tables: '/models/in',
    attrs: '/models/attrs',
  },
  // auth: [
  //   {
  //     key: 'xiaofei',
  //     secret: '68b5dfc0-4c82-11e9-81c9-73dbcff02bd1',
  //     ignore: [ 'client', 'province' ],
  //     // contains: [ 'address', 'area', 'city', 'province' ],
  //   }, {
  //     key: 'zhangpei',
  //     secret: '7825dfc0-4c82-11e9-81c9-73dbcff02a31',
  //     ignore: [],
  //     contains: [],
  //   },
  // ],
};
