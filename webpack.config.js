// webpack 是基于node写的 用node的写法
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 将打包后的文件 插入到html中
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css打包成 link标签 ，之前通过module规则匹配出来的将css变成style标签
const OptimizeCss = require('optimize-css-assets-webpack-plugin'); // 将css文件进行压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Webpack = require('webpack'); // webpack也是个插件
module.exports = {
  mode: 'development', // 环境 默认两种 production development 如果这里是开发模式，是不会走优化项的
  devServer: {
    // 开发服务器的配置
    port: '3003',
    progress: true, // 启动时 是否展示进度条
    contentBase: './build', // 以这个文件夹 运行静态服务
    // compress: true, // 是否压缩
  },
  entry: './src/main.js', // 入口文件
  output: {
    filename: 'bundle.[hash:8].js', // 保证每次输出都输出不一样的文件 加上hash值
    // path 是基于node的基础模块 需要使用require 引用进来
    path: path.resolve(__dirname, 'build'), // __dirname 在当前目录下创建，
  },
  // externals: { // 不打包 
  //   jquery: '$'
  // },
  plugins: [
    // plugins 千万不要漏了s
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板 以哪个文件作为模板
      filename: 'index.html', // 打包出来后的名字也叫html
      // minify: { removeAttributeQuotes: true }, // 删除属性双引号
      hash: true,
    }),
    new MiniCssExtractPlugin({ filename: 'main.css' }), // 将css打包成link标签 名称 main.css
    new Webpack.ProvidePlugin({
      '$': 'jquery', // 一个全局
    })
  ], // 数组 存放所有webpack插件
  optimization: {
    // 优化项
    minimizer: [
      new UglifyJsPlugin({
        cache: true, // 是否缓存
        parallel: true, // 使用多线程进行打包
        sourceMap: true, // 将错误信息映射到源码的模块 这个会降低打包的速度
      }),
      new OptimizeCss(),
    ], // 优化的内容可能是多个 所以这里是个数组
  },
  module: {
    // 模块
    rules: [
      {
        test: require.resolve('jquery'), // 这里的require.resolve 是node的调用(用来获取模块的绝对路径) 与webpack的require.resolve处理流程无关
        use: [{
          loader: 'expose-loader',
          options: {exposes: '$'} // 如果不想这么配置，可以给每个模块都注入一个$
        }]
      },
      {
        // 给js代码配置规则
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              enforce: 'pre', // pre前置 normal普通 post后面  因为loader是从下往上执行的，加了这个属性能修改执行的顺序
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 用babel-loader将ES6 -> ES5
              presets: ['@babel/preset-env'],
              plugins: [
                // 只有最外层的plugin模块才需要引用进来 然后new xxPlugin() 传入参数来进行使用
                // 在module 里面的plugins 只需要写成数组的形式就可以了
                // 后面的两个参数不能不写，这里是参考官网的配置方法
                // https://babeljs.io/docs/en/babel-plugin-proposal-decorators
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                '@babel/plugin-transform-runtime', // 允许重用Babel注入的帮助代码以节省编码的插件。
              ],
            },
          },
        ],
        include: path.resolve(__dirname, 'src'), // 只是处理src下面的目录
        exclude: /node_modules/, // 排除处理的目录
      },
      // 规则
      // css-loader 用来处理@import 这用语法的
      // css-loader 用来处理css文件 style-loader是用来将css文件插入到html中的head中
      // loader的顺序是从右往左执行的 从下到上执行
      // loader 可以是个对象 [{loader: 'css-loader', option:{XXXXX}}]
      // loader
      {
        test: /\.css$/,
        use: [
          // {
          //   loader: 'style-loader',
          //   // options: { insertAt: 'top' }, // style放的位置 放在style标签里
          // },
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader', // 在处理css前先加上前缀
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'], // 解析less文件，先要使用less-loader 解析完变成之后再用css-loader解析
        // sass-loader-> node-sass
      },
    ],
  },
};
// 修改webpack config的名字
// npx webpack --config webpack.config.js （名字）
// 脚本配置 scripts: {"build": "webpack"}
// 如果想在运行的时候才加上config参数 需要多加两个--  npm run build (-- 如果不加这两个--，运行脚本时会认为后面传入的参数是个字符串) --config webpack.config.js
// 配置webpack 打包时的命令，但是这里不需要npx webpack 这里可以自动在node_module 下面找个这个命令找到这个文件
//  对js文件进行解析转化 babel-loader @babel/core @babel/preset-env(转化所有的js语法)
// 这个插件转换静态类属性以及用属性初始化器语法声明的属性 @babel/plugin-proposal-class-properties
// @babel/runtime 生产依赖 给生产环境中注入脚本
// @babel/polyfill

// ! require.resolve() 解析
/**
 * require.resolve(request[, options])
 * request <string> 需要解析的模块路径。返回的是这个文件的相对路径 
 * option <Object>
 *  - path<string[]> 从中解析模块位置的路径。这意味着从该位置开始检查 node_modules 层次结构。
 * 使用内部的 require() 机制查询模块的位置，此操作只返回解析后的文件名，不会加载该模块。
 */