# JS函数式编程 - 第二次理解
---

## 以前我眼里的函数式编程
> 纯函数、不影响外部状态、高抽象度... 没... 没了吧。从一而终的纯函数，不受任何外部变量影响，也不影响任何外部变量的高度抽象性。大概就是我所认为的函数式编程的最迷人的地方，但是，貌似也仅此而已。

### 有什么用啊...? 我也不知道
### 除了写redux的时候就没用过了

> 这是纯函数被黑的最惨的一次 QwQ

## 纯函数

> 可以理解为一种相同的输入必定有相同的输出的函数，没有任何可以观察到副作用，也就是执行了纯函数之后，不会对原来的数据有影响

## 纯函数的优点

- 更加容易被测试，因为它们唯一的职责就是根据输入计算输出
- 结果可以被缓存，因为相同的输入总会获得相同的输出
- 更容易被调用，因为你不用担心函数会有什么副作用

---
## 从了解curry开始
> 恩，函数式编程的世界里的确到处充满着纯函数。可以说纯函数从头到尾贯穿了函数式编程！

那简单的纯函数之后，我们先了解一下对纯函数的一个加强处理 -> `curry function`（函数柯理化）
> 函数柯理化是指把一个函数柯理化，然后柯理化后的函数简单来说...就是可以随便传参。本来传三个参数，可以传一个，然后会返回接受余下参数的新函数
``` javascript
// example
function haha(one, two, three) {
    console.log(one, two, three)
}

// 函数haha$就是柯理化的haha
var haha$ = curry(haha)
var haha$$ = haha$(1)    // 返回一个函数，这个函数还可以接受两个参数，分别就是上面的two和three
haha$$(2, 3)            // 打印 “1 2 3”
// 也可以
haha$(1, 2, 3)          // 打印“1 2 3”
```
### 柯理化大概就这意思

> 优点：柯理化可以对纯函数进行"预加载"，对参数进行缓存。这为函数组合提供了更灵活的手段，有利于接口专用化。把纯函数变成专用纯函数，降低通用性，提高专用性。

``` javascript
// 贴上自行实现的curry
function curry(fn, length) {
    // 取得函数参数的长度，如果陷入了第二次递归curry自然会使用到length来记住已经被消费的参数
	var len = length || fn.length
	return function() {
	    // 取得调用时传入的参数的个数
		var innerLen = arguments.length
		// 如果还有剩余未消费(传入)的参数
		if(arguments.length < len) {
		    // 把fn和这里传入的参数合并起来
			var combined = [fn].concat(toArray(arguments))
			// 尾递归优化，递归调用curry并且使用subCurry把第一个参数（也就是fn）去掉（这一步在调用时才会产生效果），注意传入已剩余参数的长度标记
			return curry(subCurry.apply(this, combined), len - innerLen)
		} else {
		    // 如果参数已经被消费完了，直接调用apply。若已多次调用上面的curry递归的话，fn已经不是本来的fn了，所以只起执行函数的作用
			return fn.apply(this, arguments)
		}
	}
}

function subCurry(fn) {
	var args = Array.prototype.slice.call(arguments, 1)
	return function() {
		return fn.apply(this, args.concat(toArray(arguments)))
	}
}

function toArray(arr) {
	return Array.prototype.slice.call(arr)
}
```

---
## 再说说PointFree
> PointFree其实就是无值的意思。与其说是技术，`PointFree`倒不如说是一种思想。

在数学上，函数的意思是固定输入，固定输出，输入的值通过一系列操作输出另一个对应的值。

而`PointFree`正是反应了这种思想。与输入和输出无关，`PointFree`反应的是中间这个处理过程。把中间对输入值进行处理的过程拆分成一个又一个很小的`纯函数`，组合一系列输入输出之后输出正确的结果，所以`PointFree`就是不使用所要处理的值，只合成运算过程。

`PointFree`不关心要处理的值，只关心要进行处理的过程，所以可以看作一个巨型纯函数。纯函数的确贯穿函数式编程

> 其实redux实现中间件的思想是`PointFree`最明显的体现，通过可自由组合的中间件的`compose`，把一系列的中间件（纯函数）包装成一个完整的处理过程，包装过后再输入`action`的时候，将会对`action`进行不同的处理（当然原来的`dispatch`会放在最里面，成为最后一个输入输出的小组件用于修改`store`， 不过中间件有中间件独特的签名）

``` javascript
// compose
function compose() {
	var funcs = toArray(arguments)
	return function(data) {
	    // 返回把函数嵌套起来的结果，类似add(reduce(data))这样的结果，从后面开始调用
		return funcs.reduceRight(function(lastRes, func) {
			return func(lastRes)
		}, data)
	}
}

function toArray(arr) {
	return Array.prototype.slice.call(arr)
}

```
以上实现的`compose`可以用于合并N个纯函数用于合成一个大的纯净处理器

---
## 容器、Functor
> 终于还是来到了`Functor`，所谓`Functor`就是一个包着数据的容器。那为什么需要这个容器呢。回顾一下函数式编程的核心，纯函数：**对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态**。不过实际的编程中，我们不可能不依赖或改变外部环境。这个时候我们就需要一个`Functor`来装着我们处理的输入，并保证它不与外界接触。`Functor`是容器，也是隔膜。

``` javascript
var Container = function(x) {
	this._value = x
}

// 用一个.of方法代理new
Container.of = function(x) {
	return new Container(x)
}
```

我们为了另这个输入数据不受影响，用一个容器将其装起来，可是同时普通的函数也无法对其造成影响。所以我们定义了一个接口用于将操作方法传进去

``` javascript
Container.prototype.map = function(fn) {
    return Container.of(fn(this._value))
}

// we can do this
var c = Container.of(2)

console.log(
	c.map(function(data) {
		return data + 1
	}).map(function(data) {
		return data - 3
	})
)   // 0

console.log(c)  // 2

// 所以包在容器里不会影响到外部的数据，不依赖外部状态
```
这个方法的意思是通过`Container`实例上调用这个方法，传入一个操作的纯函数，对容器里的值进行操作，然后重新把这个值包起来。并且把自己返回回来。

### **Functor就是实现了map并且遵守一些规则的容器**

> `Functor`还有很多种类：比如`Maybe`（就是`Container`多了个判空）

如果觉得每传入一个函数就要写一次`map`，我们可以通过`PointFree`把烦人的`map`去掉，下面还运用了函数柯理化预设处理函数，这样做可以预设函数，然后随意调用`Functor`
``` javascript
// 把func操作函数放前面，所以可以先传入预设的处理函数，然后再传入Functor可以马上返回任意Functor的map方法
var map = curry(function(func, functor) {
    return functor.map(func)
})

// we can do this
var c = Container.of(1)

function add(data) {
    return data + 1
}

function reduce(data) {
    return data - 2
}

console.log(
    map(compose(add, reduce))(c)
)   // 0

// or
console.log(
    c.map(compose(add, reduce))
)
```
## 关于错误处理、Either
> `Either`用于错误处理，就跟`Functor`没多大区别。因为`try...catch`不纯

``` javascript
var Left = function(x) {
  this.__value = x;
}
var Right = function(x) {
  this.__value = x;
}

Left.of = function(x) {
  return new Left(x);
}
Right.of = function(x) {
  return new Right(x);
}

Left.prototype.map = function(f) {
  return this;
}
Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}
```
可以看到`Left`就是错误的处理，它的`map`方法是直接返回自己，而`right`的`map`方法是拿出数据，修改，再封回去容器，跟`Container`一样

---
## IO Functor
> 与其他`Functor`不同的是这个容器的`._value`是一个函数，当调用这个`._value`的时候才会开始执行

---
## Monad
> 我看到一句很令人欣喜的话，**`Promise`就是一种`Monad`**。简单来说就是`Monad`其实就是函数式编程的异步实现。

---
## 实际应用
- `Redux`处处充满函数式编程的小细节，每一个`reducer`就是一个纯函数，`combineReducers`出来的大`Reducer`也是纯函数，通过每次`dispatch`来进行计算出最新的状态，而非全局保存状态。`dispatch`中实现的中间件机制，也体现了`PointFree`的思想，`compose`了一堆方法用于处理输入了`action`
- `RxJS`，`Rx`的神奇之处在于它的响应式编程。用于页面的交互事件和异步请求的处理十分棒。`RxJS`的链式调用和事件流思想，运用到事件交互上十分方便。`RxJS`的事件流也是纯函数，固定输入固定输出。

---
参考：
1. [阮一峰 - PointFree][1]
2. [JS函数式编程指南][2]
3. [函数式 - JavaScript][3]
4. [JavaScript函数式编程系列][4]
5. [函数式JavaScript - Curry][5]

  [1]: http://www.ruanyifeng.com/blog/2017/03/pointfree.html
  [2]: https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/
  [3]: http://insights.thoughtworkers.org/functional-javascript/?utm_source=tuicool&amp;utm_medium=referral
  [4]: https://zhuanlan.zhihu.com/p/21714695
  [5]: http://blog.jobbole.com/77956/