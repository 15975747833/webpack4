// import './a.js';
// import './index.css';
import './index.css';
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
