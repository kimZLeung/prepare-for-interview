# JS的作用域

> 「词法作用域」与「动态作用域」
> 词法作用域是静态的，动态作用域是动态的。

```
function foo(){
  console.log(a)
}

function bar(){
  let a = 3
  foo()
}

let a = 2

bar()
```

## 为什么呢？

> 这是因为JS采用的是词法作用域，词法作用域是什么鬼，词法作用域就是：函数的作用域在函数定义的时候就决定了。

---

# JS的执行上下文
> 执行上下文栈是JS开始执行就会创建出来的一个东西。以下是我自己的理解：执行上下文栈是一个栈，每当有一个函数被调用时，就会往这个栈推进去一个这个函数对应的执行上下文。当

```
function a() {
    function b() {
        console.log('haha')
    }
    b()
}

a()


// 一段程序开始执行时是最先进入全局执行上下文的(global)，在全局上下文的基础上初始化生成必要的函数和对象。然后调用a的时候，进入函数a的执行上下文，在a里面初始化了b并且调用了b，所以在a函数执行完成之前，又继续往执行上下文这个栈里面推进去了b这个函数的执行上下文
 ----------          ---------           ---------
|  global  |  ----  |    a    |   ----- |    b    |
 ----------          ---------           ---------


function a() {
    function b() {
        console.log('haha')
    }
    return b
}

a()()

// 这段代码执行下来，执行上下文是这样的
 ----------          -------  
|  global  | -----  |   a   | 
 ----------          -------
               |
               |
               ↓
  ----------         -------
 |  global  | ----- |   b   |
  ----------         -------
```

每个执行上下文都包含有

- [x] 变量对象（包含了这一个函数声明的变量，传入的参数，函数的声明）
- [x] 作用域链
- [x] this指针

---

# 作用域链

> 一个函数的作用域链在创建的时候已经大概差不多搞定了，[[Scope]]是一个包含了所有上层变量对象的分层链,它属于当前函数的上下文,并在函数创建的时候,保存在函数中.

> 当函数被调用时，进入函数的执行上下文，此时创建这个函数的活跃对象并且确定它的`this`值的指向和真正的作用域链

```
作用域链 = [[Scope]] + 执行时的活跃(active)上下文
// [[Scope]]就是在函数声明的时候已经确定了，包含一堆或者一个变量对象，只有一次并且一直都存在，直到函数销毁.
```


# this

> this的四种绑定方法分别是：
- 默认绑定 (<span>纯粹的函数调用</span>)
- 隐式绑定 (作为对象方法的调用)
- 显式绑定 (apply(),call()调用，bind())
- new绑定 (作为构造函数调用)

> 默认绑定：这个是最简单的绑定,最常用的调用类型：独立函数调用
```
function foo() {
    console.log( this.a );
}
var a = 2;
foo();     // 2
```
> 但在严格模式下,默认绑定不起作用
```
function foo() {
    "use strict";
    console.log( this.a );
}
var a = 2;
foo(); // TypeError: `this` is `undefined`
```

---

> 隐式绑定：show code
```
function foo() {
    console.log( this.a );
}
var obj = {
    a: 2,
    foo: foo
};
obj.foo(); // 2
```



    function foo(num){
          console.log("foo: " + num);
          this.count++;
      }
      foo.count = 0;
      for(var i=0; i<10; i++){
          if(i > 5){
              foo.call(foo, i); //使用call()可以确保this指向函数本身
          }
      }
       // foo: 6
       // foo: 7
       // foo: 8
       // foo: 9
      console.log(foo.count);// 4

----------


> 隐式丢失：
```
function foo() {
    console.log( this.a );
}
var obj = {
    a: 2,
    foo: foo
};
var bar = obj.foo; // function reference/alias!
var a = "oops, global"; // `a` also property on global object
bar(); // "oops, global"
```
> 全局调用bar()，相当于全局调用foo，这个时候打印出的是全局的a，也就是"oops, global"。所谓的隐式丢失也就是调用对象的方法时本质上变成了全局调用对象的方法，所以回到了全局调用函数的情况，变成了默认绑定，所以this此时指向全局。

        function foo(){
            console.log(this.a);
        }
        function callBack(fn){
            fn();
        }
        
        var obj = {
            a: 2,
            foo: foo
        }
        var a = "global";
        callBack(obj.foo); // "global"

> 回调函数，callBack函数传了一个参数是函数的引用，执行callBack函数时，arguments[0]是obj.foo函数的引用，因为参数是值传递，就是一种隐式赋值，所以调用函数时其实通过var fn = obj.foo；然后通过fn()来调用这个函数，所以又回到了默认绑定的形式。(参数也是数啊。。)

---

> 显式绑定：显式绑定用到了call()和apply()方法，因为可以直接指定this的绑定对象，因此称之为显式绑定。
```
function foo() {
    console.log( this.a );
}
var obj = {
    a: 2
};
foo.call( obj ); // 2
```
> ...把foo函数强行丢到obj的作用域下面执行。this指向obj

> 硬绑定：也属于显式绑定。
```
function foo() {
    console.log( this.a );
}
var obj = {
    a: 2
};
var bar = function() {
    foo.bind( obj );
};
bar(); // 2
setTimeout( bar, 100 ); // 2
// `bar` hard binds `foo`'s `this` to `obj`
// so that it cannot be overriden
bar.call( window ); // 2
```
> 因为我们强制把foo的this绑定到了obj,无论之后如何调用bar,之后的操作并不会覆盖之前的，它总会在obj上调用foo。

---

> new绑定：使用new来调用foo()时，我们会构造一个新对象并把它绑定到foo()调用中的this上。
```
function foo(n) {
    this.studentNum = n;
    this.name = 'cnio'
}
var bar =  new foo(1)
console.log(bar) // foo {studentNum: 1, name: "cnio"}
```
调用构造函数new出一个对象时，构造函数里面的this因为这个new绑定机制，此时的this指向构造出来的实例对象。
> 首先我们重新定义一下JavaScrit中的“构造函数”。在Javascript中，构造函数只是一些使用new操作符时被调用的函数。它并不会属于某个类，也不会实例化一个类。实际上它甚至都不能说是一种特殊的函数类型，它们只是被new操作符调用的普通函数而已。包括内置对象函数在内的所有函数都可以用new来调用，这种函数被称为构造函数调用，这有个非常细微的区别：实际上并不存在所位的“构造函数”，只有对于函数的“构造调用”。
```
var x = 2;
function test(){
　　this.x = 1;
}
var o = new test();
alert(x); //2
```
> 使用new对函数<span>构造调用</span>后
1. 创建一个全新的对象
2. 这个新对象会被执行[[prototype]]连接
3. 这个新对象会绑定到函数调用的this
4. 如果函数没有返回其他对象，那么new表达式中的函数会自动返回这个对象。

---

> 优先级：new绑定 > 显式绑定 > 隐式绑定

```
function foo() {
    console.log( this.a );
}

var obj1 = {
    a: 2,
    foo: foo
};

var obj2 = {
    a: 3,
    foo: foo
};

obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call( obj2 ); // 3
obj2.foo.call( obj1 ); // 2
```
> 调用obj1.foo()和obj2.foo()分别将foo()中的this隐式绑定到了两个对象，然后下面再用使用call方法obj1的foo()方法显式绑定到obj2上，发现输出的是obj2的a值，所以显式绑定比隐式绑定优先级高


```
function foo(something) {
    this.a = something;
}

var obj1 = {
    foo: foo
};

var obj2 = {};

obj1.foo( 2 );
console.log( obj1.a ); // 2

obj1.foo.call( obj2, 3 );
console.log( obj2.a ); // 3

var bar = new obj1.foo( 4 );
console.log( obj1.a ); // 2
console.log( bar.a ); // 4
```
> 最后用new并用了隐式绑定构造了bar对象。bar对象的a值时4，证明new绑定比隐式绑定优先级高。

> 那显式绑定和new绑定：
```
function foo(something) {
    this.a = something;
}
var obj1 = {};
var bar = foo.bind( obj1 );
bar( 2 );
console.log( obj1.a ); // 2

var baz = new bar( 3 );
console.log( obj1.a ); // 2
console.log( baz.a ); // 3
```
> 用bind把foo函数硬绑定在了obj1对象下执行并用bar指向这个构造函数。然后再用调用这个东西构造一个baz，this指向了baz表明用了new绑定。

> 优先级：new绑定 > 显式绑定 > 隐式绑定

---

## 箭头函数
> 一个箭头函数表达式的语法比一个函数表达式更短，并且不绑定自己的 this，arguments，super

那么箭头函数的this有什么不同呢

箭头函数会捕获其**所在上下文**的  this 值，作为自己的 this 值

```
function Person() {
    this.age = 0;
    setInterval(() => {
        this.age++;
    }, 3000);
}

var p = new Person();
```

```
function Person(age) {
	this.age = age
	const inner = () => {
		console.log(this.age)
	}
	outer.log = inner
}

var outer = {
	age: 3,
	bb: 5,
	log: function() {
		console.log(this.bb)
	}
}

outer.log()
new Person(7)
outer.log()
```

**其实总的来说，箭头函数的`this`指向的就是它词法作用域的`this`指向的地方**


- [隐式绑定](https://segmentfault.com/a/1190000004460913)
- [默认绑定，显式绑定，new绑定，优先级](https://segmentfault.com/a/1190000004515649)