## NodeJS Event loop

---

### Node Event loop 图

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

---

### NodeJS底层的Event loop

NodeJS的Event loop与浏览器的Event loop不一样，并不是分为两个队列这样子，它实现的Event loop可以分为六个阶段

- **timers**: 这个阶段执行setTimeout()和setInterval()设定的回调。
- **I/O callbacks**: 执行几乎所有的回调，除了close回调，timer的回调，和setImmediate()的回调。
- **idle, prepare**: 仅内部使用。
- **poll**: 获取新的I/O事件；node会在适当条件下阻塞在这里。
- **check**: 执行setImmediate()设定的回调。
- **close callbacks**: 执行比如socket.on('close', ...)的回调。

---

### 对于六个阶段的理解

#### timers

主要由poll阶段控制，进行`setTimeout`和`setInterval`的回调执行，会根据timer设定的下限时间尽可能早地执行回调。


#### I/O callbacks

这个阶段执行一些系统操作的回调

> 执行一些系统调用错误，比如网络通信的错误回调（官方文档里说的，感觉跟上面总结的有点自相矛盾）


#### poll

这是一个比较复杂的阶段(或者说状态)。

/*

>  首先进入poll这个阶段会首先判断是否已经有设定的timer

>  如果有，直接开始处理poll队列里面的事件，等到poll队列里面的事件清空，poll队列回到空闲状态的时候，再去检查timers,如果有1个或多个timers的下限时间已经到达，event loop将绕回 **timers** 阶段，并执行 **timer** 队列。 没有的话就下个阶段(check)。

> 如果没有timer，则判断poll队列是否为空，如果不空，则开始历队列并同步执行回调，直到队列清空或执行的回调数到达系统上限；如果为空，则分两种情况：1. 如果设置了`setImmediate()`，则直接跳去check阶段执行check的队列； 2. 如果没有设置`setImmediate()`，event loop将阻塞在该阶段等待回调被加入 poll 队列，并立即执行。

*/

（之前的理解过于复杂，这里更新理解）

其实poll阶段的过程可以简化为这样：

1. 处理poll队列里面的事件
2. 处理timer

> poll阶段，Node处理完poll的队列之后，他会去看一看有没有预设的`setImmediate()`
>
> ​	如果有，则进入check阶段执行`setImmediate()`设定的回调
>
> ​	如果没有，则会阻塞在该阶段等待poll队列再次来回调
>
> 为了确保不会一直卡在poll阶段，poll同时也会看一看有timer队列有没有东西，如果有，则进入timer开始新一轮loop


#### check

check阶段是拿来执行`setImmediate()`


#### close callbacks

如果一个 socket 或 handle 被突然关掉（比如 socket.destroy()），close事件将在这个阶段被触发，否则将通过process.nextTick()触发。

---

### setTimeout vs setImmediate

``` javascript
setTimeout(function timeout () {
  console.log('timeout');
},0);

setImmediate(function immediate () {
  console.log('immediate');
});
```

这样做的话会根据实际情况打印两行，那么执行先后取决于进程性能


``` javascript
var fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('immediate')
  })
})
```

然而把这两个设定到同一个IO的异步代码中去调用，那么永远是`setImmediate`先打印


> 第一种情况：因为放在了主模块调用，然后由于`setTimeout`的时间下限设置的值限制为[1, 2147483647]，不在这个范围里的话，默认设置为1ms，所以`setTimeout(fn, 0)`相当于`setTimeout(fn, 1)`，接下来就是比拼机器性能的时候了，如果进程跑得够快，能在1ms里面就直接从timer，一直跑到check阶段（由于poll阶段的队列也没有东西执行，然后检测不到满足时间下限的timer，就直接进入check阶段了），就会先执行`setImmediate`

> 第二种情况：因为这个IO是在poll阶段的队列里面做的。所以在进入poll阶段时没有检测到timer的设定，并且执行完队列的代码后，就直接进入check阶段，所以先执行`setImmediate`



**reference**:

- [Node.js的event loop](https://github.com/creeperyang/blog/issues/26)
- [深入理解js事件循环机制](http://lynnelv.github.io/js-event-loop-nodejs)
- [What you should know to really understand the Node.js Event Loop](https://medium.com/the-node-js-collection/what-you-should-know-to-really-understand-the-node-js-event-loop-and-its-metrics-c4907b19da4c)
- [The Node.js Event Loop, Timers, and `process.nextTick()`](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)