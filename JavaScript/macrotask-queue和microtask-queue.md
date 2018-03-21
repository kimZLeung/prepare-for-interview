## macrotask-queue和microtask-queue

---

##  macrotask-queue和microtask-queue
> JS异步的话，我能想到有`回调函数`，`Promise`，`Generator`，`async`...差不多

```
/**
 * 那如果这样写会打印什么呢？
 */
setTimeout(function(){
	console.log(4)
},0);

new Promise(function(resolve){
	console.log(1)
	for( var i=0 ; i<10000 ; i++ ){
		i==9999 && resolve()
	}
	console.log(2)
}).then(function(){
	console.log(5)
})

console.log(3);


/**
 * 或者说这这样
 */
setTimeout(function () {
    console.log(5);
}, 0);
setImmediate(function() {
    console.log(6);
});

new Promise(function (resolve) {
    console.log(1);
    resolve();
    console.log(2);
}).then(function () {
    console.log(4);
});

process.nextTick(function() {
    console.log(3);
});
```

#### 结果是`1, 2, 3, 5, 4`
这就涉及到`JS`的两个队列，就是`macrotask-queue`（宏任务队列）和`microtask-queue`（微任务队列）

---
## What?
其实这个宏任务队列就是，我们常说的任务队列，什么`setTimeout`和`setInterval`都是定时器过了之后塞里面去的。听得比较多。而微任务队列其实是`Promise.then`放进去的一个新队列，这两个队列在JS中有一定的执行顺序。

> 当我们跑起来异步任务的时候：JS 引擎会将所有任务按照类别分到这两个队列中，首先在 `macrotask` 的队列（这个队列也被叫做 task queue）中取出第一个任务，执行完毕后取出 `microtask` 队列中的所有任务顺序执行；之后再取 `macrotask` 任务，周而复始，直至两个队列的任务都取完。（值得注意的是，首次同步代码的执行算作第一次`macrotask`）

下面列出两个队列的分类：
 - `macrotask`：script（整体代码）, setTimeout, setInterval, I/O, UI rendering，setImmediate
 - `microtask`：process.nextTick, Promises（这里指浏览器实现的原生 Promise）, Object.observe, MutationObserver

> 所以说`Promise.then`玩游戏不用排队...
