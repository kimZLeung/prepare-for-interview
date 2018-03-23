### 当我们 `new` 一个类的时候 都发生了什么

```js
function _new(func) {
    // 创建了一个实例对象 o，并且这个对象__proto__指向func这个类的原型对象 
    let o = Object.create(func.prototype); 
    // (在构造函数中this指向当前实例)让这个类作为普通函数值行 并且里面this为实例对象 
    let k = func.call(o);
    // 最后再将实例对象返回 如果你在类中显示指定返回值k，
    // 注意如果返回的是引用类型则将默认返回的实例对象o替代掉
    return typeof k === 'object' ? k : o;
}
```

### 防止忘记加 `new` 的方法

```js
function Foo(){ 
  // 如果忘了使用关键字，这一步骤会悄悄帮你修复这个问题 
  if ( !(this instanceof Foo) ) 
    return new Foo(); 
  
  // 构造函数的逻辑继续…… 
}
```
### `Object.create()`干了什么

```js
Object._create = (o) => {
    let Fn = function() {}; // 临时的构造函数
    Fn.prototype = o;
    return new Fn;
}
```

