## Express对比Koa

### Express

> Express错误处理
>
> - Express提供了比较完善的错误处理
> - 你可以通过中间件的`next(err)`，把错误传递下去让错误中间件处理
> - 错误中间件固定签名四个参数`errorHandler(err, req, res, next)`
> - 处理错误的中间件一般放在最后

Express中很棒棒的一个`next`

- 当它`next()`调用时，调用下一个处理函数
- 当它`next('route')`调用时，调用下一个处理的中间件
- 当它`next(err)`调用时，抛出错误，中断下面所有中间件的处理，直接找到错误处理的中间件进行错误处理



### Koa

Koa的中间件有一个参数`ctx`，通过设置`ctx.body`来设置响应内容，`ctx`上有`request`，`response`，`req`，`res`对象，分别

- `request`是经过koa抽象封装的
- `response`是经过koa抽象封装的
- `req`是原生的node的`request`对象
- `res`是原生的node的`response`对象



### 对比

- 工具集成：`Express`本身就提供了路由的处理，而且内置`static`中间件用于资源的托管，而`Koa`没有，在`Koa`中使用路由需要安装`koa-route`，资源托管也需要安装对应的中间件
- 模板引擎：`Koa`也需要引入中间件，`Express`同样自身集成了这个功能，这显得`Koa`更加轻量化
- Express 和 Koa 最明显的差别就是 中间件 的处理方法，一个是普通的回调函数，一个是利用生成器函数（Generator Function）或者`async/await`，很明显`Koa`丢掉了`callback`
- 中间件的模型：`Koa`集成了`async/await`，我们可以很轻松地以同步的方式去写异步代码，并且中间件的运行机制是洋葱圈模型，这意味着我们可以在非常方便的执行一些后置处理逻辑。比如计算请求的时间。而`Express`并不能保证`next()`里面的代码是同步的。
- 错误处理：`Express`的错误处理是通过错误处理的中间件去做的，而`Koa`因为可以使用`async/await`，我们可以方便地对有可能出现错误的代码段进行`try...catch`捕获

