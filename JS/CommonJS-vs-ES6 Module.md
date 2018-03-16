### CommonJS 和ES6 模块化的区别

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。



### CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用

类似如下代码：

```js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

```js
// commonJS下
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

```js
// ES6的module下
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

可以看出，ES6引入的这些变量是引用，当变量本身发生变化，引入的值也会跟着变化



### CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

> ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个动态只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。

而且由于ES6模块是在编译时就建立起动态只读引用，所以不能给`import`用变量引入，因为编译时不会执行，自然无法知道变量是什么。

**ES6的`import`实际上做了什么？**

1. 语法解析：阅读模块源代码，检查语法错误。
2. 加载：递归地加载所有被导入的模块。这也正是没被标准化的部分。
3. 连接：每遇到一个新加载的模块，为其创建作用域并将模块内声明的所有绑定填充到该作用域中，其中包括由其它模块导入的内容。
4. 如果你的代码中有`import {cake} from "paleo"`这样的语句，而此时“paleo”模块并没有导出任何“`cake`”，你就会触发一个错误。这实在是太糟糕了，你都*快要*运行模块中的代码了，都是cake惹的祸！
5. 运行时：最终，在每一个新加载的模块体内执行所有语句。此时，导入的过程就已经结束了，所以当执行到达有一行`import`声明的代码的时候……什么都没发生！



> 而`CommonJS`不一样
>
> `CommonJS `的一个模块，就是一个脚本文件。`require`命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。也就是我们所说的运行时加载，所以我们才会对其`export`的对象无法做到动态引用。因为他本身就是`require`的时候执行了JS文件然后把输出结果保存起来了而已。