const path = require('path');
const absoluteRuntimePath = path.dirname(require.resolve('@babel/runtime/package.json'))

const createBabelConfig = function(isEnvDevelopment, isEnvProduction) {
  return {
    presets: [
      [require.resolve('@babel/preset-env'), {
        targets: "> 95%",
        useBuiltIns: 'entry',
        // Set the corejs version create-react-app using to avoid warnings in console
        corejs: 3,
        // Exclude transforms that make all code slower
        exclude: ['transform-typeof-symbol'], 
      }],
      [require.resolve('@babel/preset-react'), {
        // 添加 组件栈 警告与报错
        // Adds __self attribute to JSX which React will use for some warnings
        development: isEnvDevelopment,
        runtime: 'automatic'
      }]
    ],
    plugins: [
      // Remove PropTypes from production build
      isEnvProduction && [
        require.resolve('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true,
        },
      ],
      [require.resolve("@babel/plugin-syntax-dynamic-import")],
      [require.resolve("@babel/plugin-transform-runtime"), {
        corejs: false, // 不使用babel-runtime编译api
        helpers: true, // 抽取helpers函数
        // 指定 babel-runtime 的版本
        version: require('@babel/runtime/package.json').version,
        // 对 generate 函数使用 regenerator runtime 而不污染全局变量
        regenerator: true,
        // 7.13.0 已被弃用，用于使用 false:exports.default true:export default
        useESModules: false,
        // 允许从教授架中加载 @babel/runtime
        absoluteRuntime: absoluteRuntimePath, 
      }]
    ].filter(Boolean),
  }
}
module.exports = createBabelConfig(true, false);