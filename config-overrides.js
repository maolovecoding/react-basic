const { override, addBabelPlugin } = require("customize-cra");

module.exports = override(
  addBabelPlugin([
    "@babel/plugin-proposal-decorators",
    {
      // 启用老的模式
      legacy: true,
    },
  ])
);
