## 有一些比较有意思的面试题



### 1

```js
var a = { n: 1 }
var b = a
a.x = a = { n: 2 }
console.log('a.x:', a.x)
console.log('b.x:', b.x)
```

打印的结果是undefined，{ n: 2 }

> 这涉及到JS对赋值运算符的处理过程，关键代码是这一行 a.x = a = { n: 2 }，JS的赋值运算符的处理过程可分为四步，第一步是取得左边的值或者地址，然后再取右边的值或者地址，然后把右边赋值给左边，然后返回右边的值或者地址

所以这一行代码`a.x = a = { n: 2 }`其实是先确定左边的值或者地址，`a.x`里面的`a`此时为原来的`a`，也就是`b`指向的那个`{ n: 1 }`，然后中间那个`a`是一个变量保存地址，之前是指向`{ n: 1 }`，赋值后指向`{ n: 2 }`然后这个赋值表达式返回`{ n: 2 }`也就是说这条语句运行到这里，变为`a.x = { n: 2 }`，因为此时a.x在之前已经确定了a是指向原来那个`{ n: 1 }`的（也就是b），所以赋值到了`b`指向的那个`{ n: 1 }`，所以最后b的结构是`{ n: 1, x: { n: 2 } }`



### 2

继承的方式：

- 有构造函数参与的继承：简单来说即继承过程中带new操作符的
- 非构造函数的继承：简单来说即继承过程不会涉及new操作符的



**有构造函数参与的继承**

- 在子类构造函数中调用父类构造函数`apply`或者`call`
- 子类的原型`prototype`直接指向父类实例
  - 缺点：但是这样做有可能会把父类多余的单例属性放到子类的原型上
- 子类的原型直接指向父类的原型
  - 优点：不会让子类的原型有多余的属性
  - 缺点：对子类原型的修改也会导致到父类原型的修改
- 利用一个空的构造函数的原型指向父类原型，然后通过`new`操作符实例化出这个对象，作为子类的原型。
  - 优点：独立出来子类和父类的原型，从而避免修改子类原型导致修改父类原型
- 利用属性拷贝，直接把父类原型上的属性一个一个地拷贝给子类原型：

```javascript
/**
 * 这样做的话，其实也是一个方法，但是一些引用属性会重复使用，有时可能会产生bug
 */
function copyExtend (child, parent) {
  var p = parent.prototype
  var c = child.prototype
  for (var i in p) {
    c[i] = p[i]
  }
  c.uber = p
}
```

> 若是有父类实例上的属性需要继承下来的话，记得在子类构造函数里调用父类构造函数
>
> ```javascript
> function sub (option) {
>   super.call(this, option)
>   this.xx = option.xx
> }
> ```



**没有构造函数参与的继承（其实就是简单地属性复制，在这个分类里没有类的概念，只有实例）**

- 直接使用`object`方法，传入父对象，返回子对象

  ```javascript
  function object (o) {
    function F () {}
    F.prototype = o
    return new F()
  }
  ```

  其实本质上也使用了`new`操作符，不过`object`方法把`new`操作符封装起来了，对外部使用透明，实际上是用一个对象创建另一个对象的过程，把父类对象直接作为子类对象的原型（其实与上面的第四种方法很像，具体看使用时传入的o是什么，返回值用来干什么）

- 浅拷贝，直接不使用`prototype`把父对象的属性直接全部拷贝给子对象

```javascript
function extendCopy (p) {
  var c = {}
  for (var i in p) {
    c[i] = p[i]
  }
  c.uber = p
  return c
}
```



- 深拷贝，递归调用"浅拷贝"

  ```javascript
  function deepCopy (p, c) {
    var c = c || {}
    for (var i in p) {
      if (typeof p[i] === 'object') {
        c[i] = (p[i].constructor === Array) ? [] : {}
        deepCopy(p[i], c[i])
      } else {
        c[i] = p[i]
      }
    }
    return c
  }
  ```

  ​

  ​

