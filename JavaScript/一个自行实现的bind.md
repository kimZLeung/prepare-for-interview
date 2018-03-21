## 自行实现的bind

**理一理bind函数的特点**

- 返回一个函数
- 可以绑定执行时的`this`值
- 可以预先传参
- 返回的函数使用`new` 调用依然可以继承原来的原型，并且`this`在调用时指向新的实例，而不是指定的上下文



```js
Function.prototype._bind = function (ctx) {

    var self = this
    var args = Array.prototype.slice.call(arguments, 1)

    return function (...innerArgs) {
        return self.apply(ctx, args.concat(innerArgs))
    }

}
```



- [x] 返回函数
- [x] 绑定`this`
- [x] 预先传参


- [ ] 返回的函数使用`new` 调用依然可以继承原来的原型，并且`this`在调用时指向新的实例，而不是指定的上下文



> 进行修改，当函数被`new`操作符调用时，函数内部的`this`值的指向会发生变化，通过判断这种情况去动态绑定函数的`this` 值，并且通过继承原函数的原型实现继承，具体例子



```js
Function.prototype.bind2 = function (ctx) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this
    var args = Array.prototype.slice.call(arguments, 1)

    var fNOP = function () {}

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments)
        return self.apply(this instanceof fNOP ? this : ctx, args.concat(bindArgs))
    }

    fNOP.prototype = this.prototype
    fBound.prototype = new fNOP()
    return fBound
}
```

