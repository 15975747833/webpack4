// import './a.js';
// import './index.css';
import './index.css';
require('@babel/polyfill'); // polyfill 相当于补丁 给浏览器打补丁，让低版本的浏览器支持高级的语法 generator promise等等
console.log(1112);
const fn = () => {
  console.log('ES6');
};
@log
class A {
  a = 1;
}
let a = new A();
console.log(a.a);
console.log('class');
// 装饰器就是一个函数 里面的内容就是参数 我现在装饰一个类
function log(target) {
  console.log(target); // new A()
}
function* gen() {
  yield 1;
}
console.log(gen().next());
