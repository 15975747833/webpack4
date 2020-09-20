// import './a.js';
// import './index.css';
// import './index.css';
// require('@babel/polyfill'); // polyfill 相当于补丁 给浏览器打补丁，让低版本的浏览器支持高级的语法 generator promise等等
// console.log(1112);
// const fn = () => {
//   console.log('ES6');
// };
// @log
// class A {
//   a = 1;
// }
// let a = new A();
// console.log(a.a);
// console.log('class');
// // 装饰器就是一个函数 里面的内容就是参数 我现在装饰一个类
// function log(target) {
//   console.log(target); // new A()
// }
// function* gen() {
//   yield 1;
// }
// console.log(gen().next());

import $ from 'jquery';
// import $ from 'expose-loader?exposes[]=$!jquery'; // 安装完jq之后，并没有将jq变成window下的一个变量
// 也可以在webpack module的下配置
// expose-loader 暴露给全局的loader
// ‘expose-loader?$!jquery’ 这是一个内敛loader 是写在代码里面的 ？！ 把jquery暴露成$符号 中间写的$是个参数，是以什么形式进行暴露出去
console.log($);
console.log(window.$);
// import $ from 'jquery'; // 如果这里引用了jquery 而且又在cdn引入了 需要配置一个external 使得这个模块不打包
// console.log($); // 这个方式是使用了webpack.providePlugin 每个模块都引入
/**
 * 引入第三方模块
 * 1. 使用expose-loader 暴露到window上
 * 2. 使用webpack.providePlugin 给每个对象提供$对象
 * 3. 引入不打包 externals
 */