// webpack 是基于node写的 用node的写法
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 将打包后的文件 插入到html中
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css打包成 link标签 ，之前通过module规则匹配出来的将css变成style标签
const OptimizeCss= require('optimize-css-assets-webpack-plugin'); // 将css文件进行压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); 
module.exports = {
  mode: 'production', // 环境 默认两种 production development
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
  plugins: [
    // plugins 千万不要漏了s
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板 以哪个文件作为模板
      filename: 'index.html', // 打包出来后的名字也叫html
      // minify: { removeAttributeQuotes: true }, // 删除属性双引号
      hash: true,
    }),
    new MiniCssExtractPlugin({ filename: 'main.css' }), // 将css打包成link标签 名称 main.css
  ], // 数组 存放所有webpack插件
  optimization: { // 优化项
    minimizer: [
      new UglifyJsPlugin({
        cache: true, // 是否缓存
        parallel: true, // 使用多线程进行打包
        sourceMap: true // 将错误信息映射到源码的模块 这个会降低打包的速度
      }),
      new OptimizeCss()
    ] // 优化的内容可能是多个 所以这里是个数组
  },
  module: {
    // 模块
    rules: [
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
