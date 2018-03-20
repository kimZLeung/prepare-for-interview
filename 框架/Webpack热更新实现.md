### Webpack如何实现热更新

- `webpack-dev-server`貌似是用`websocket`实现的
- `webpack-hot-middleware`是用`EventSource `实现的

> EventSource 是 HTML5 中 Server-sent Events 规范的一种技术实现。EventSource 接口用于接收服务器发送的事件。它通过HTTP连接到一个服务器，以text/event-stream 格式接收事件, 不关闭连接。通过 EventSource 服务端可以主动给客户端发现消息，使用的是**HTTP协议**，**单向通信**，只能**服务器向浏览器发送**。 比WebSocket 轻量，使用简单

```js
var s = new EventSource('url')
s.onmessage = function (e) {
    console.log(e.data)
}
```



### 为什么需要 HMR

- live reload 工具并不能够保存应用的状态（states），当刷新页面后，应用之前状态丢失，还是上文中的例子，点击按钮出现弹窗，当浏览器刷新后，弹窗也随即消失，要恢复到之前状态，还需再次点击按钮。而 Webapck HMR 则不会刷新浏览器，而是运行时对模块进行热替换，保证了应用状态不会丢失，提升了开发效率。
- HMR 兼容市面上大多前端框架或库，比如[React Hot Loader](https://github.com/gaearon/react-hot-loader)，[Vue-loader](https://github.com/vuejs/vue-loader)，能够监听 React 或者 Vue 组件的变化，实时将最新的组件更新到浏览器端。



### 开始连接

刚开始有一条event-steam。有action: sync 和 hash：xxxxxx。

后面还会不断定时发送一个心跳过来，主要是用于：

- 为了保证后端与客户端通信保持连接，后端隔一段时间会向客户端发送一段信息。



### 每次更新会从服务端推送两个文件过来

一个`json`，一个`js`，每次热更新都会通过event-steam返回两个message，并且从服务端请求回来帮助更新的`json`和`js`，并且把`js`动态插入到`head`标签中

这两个文件一个是说明更新了什么，另外一个是更新的模块代码



### 这里说通过`webpack-hot-middleware`热更新的过程

主要是发event-steam，通过监听`webpack`的一些事件来发送event-steam

- 监听compile事件发送building
- 监听done事件发送built

更新时收到的两条message就是这个中间件发送的。



### 再说说客户端

客户端通过打包进 [webpack-hot-middleware/client.js](https://link.zhihu.com/?target=https%3A//github.com/glenjamin/webpack-hot-middleware/blob/master/client.js) 的代码到入口文件

为代码添加了一些逻辑

```js
var source = new window.EventSource('(http://127.0.0.1:9000/__webpack_hmr)') 	// path参数
source.onopen = handleOnline; // 建立链接
source.onerror = handleDisconnect;
source.onmessage = handleMessage; // 接收服务端消息，然后进行相应处理
```

以下是对event-steam进行处理的过程

```js
function processMessage(obj) {
  switch(obj.action) {
    case "building": 
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +"rebuilding"
        );
      }
      break;
    case "built": // 这里没有break，所以 编译完成会执行 build 和 sync 逻辑
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // 继续调用processUpdate
    case "sync":
      processUpdate(obj.hash, obj.modules, options);
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }
}
```



> 自己的理解：简单来说通过这个`processUpdate`函数，可以进入热更新过程，通过上次返回的event-steam的hash，利用ajax请求热更新的json，拿到下次更新的hash值，然后利用本次的hash值动态创建`script`标签，引用服务端生成的热更新的`JS`文件。通过HMR的API去进行热更新

通过HMR的API更新分三步

- 找出 过期的模块 和 依赖
- 从缓存中删除过期的模块和依赖
- 将新的模块添加到 modules 中

> 如果在热更新过程中出现错误，热更新将回退到刷新浏览器

```js
// 那这段代码
if (module.hot) {
    module.hot.accept()
}
```

这段代码我通常会写在入口文件，目的是通知业务代码，热更新已经装上了，可以require加载新的模块运行了。（若是没有这段捕获代码，也会回退到刷新浏览器）



别人的总结：

1. Webpack编译期，为需要热更新的 entry 注入热更新代码(EventSource通信)
2. 页面首次打开后，服务端与客户端通过 EventSource 建立通信渠道，把下一次的 hash 返回前端
3. 客户端获取到hash，这个hash将作为下一次请求服务端 hot-update.js 和 hot-update.json的hash
4. 修改页面代码后，Webpack 监听到文件修改后，开始编译，编译完成后，发送 build 消息给客户端
5. 客户端获取到hash，成功后客户端构造hot-update.js script链接，然后插入主文档
6. hot-update.js 插入成功后，执行hotAPI 的 createRecord 和 reload方法，获取到 Vue 组件的 render方法，重新 render 组件， 继而实现 UI 无刷新更新。