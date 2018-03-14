## WebWorker

---

### API

- navigator对象，包含四个属性：appName，appVersion，appVersion，userAgent
- location对象：与浏览器的location对象一样
- self对象：就是指向自己这个worker
- 全局importScripts方法：用于引入其他JS，这个方法是同步的，引入之后才会继续执行这个Worker，但因为Worker是后台运行的线程，所以并不会阻塞UI线程，即不会使页面卡顿
- 所有的ECMAScript对象
- XMLHttpRequest：用于异步请求
- 全局setTimeOut和setInterval方法
- 全局close()方法（在外部想终止WebWorker可以使用WebWorker.terminate();）

---

### 使用场景

一般使用于十分复杂的前端数据处理，可以直接封装一个JS的工厂，通过`postMessage()`传入指定的参数，然后通过`WebWorker`引入这个JS来进行大量数据的批量处理。

---

### 共享WebWorker

共享WebWorker可以同时被多个脚本使用，用法和普通的WebWorker十分相似

``` javascript
var myWorker = new SharedWorker('worker.js')

myWorker.port.onmessage = function (e) {
	console.log(e.data)
}

myWorker.port.postMessage([value1, value2])

```

``` javascript
// worker.js

self.onconnect = function (e) {
	var port = e.ports[0]

	port.postMessage(e.data[0] + e.data[1])
}

```

简单来说就是：在worker里面使用onconnect接受数据，然后每一个的数据交互都要显式声明port —— 一个确切的打开的端口供脚本与worker通信

---

#### Summary：处理大量数据而又不阻塞UI线程的一种比较好的选择方案
