### 梳理前端向计网知识点

> 从输入URL到页面加载的过程

1. 从浏览器接收url到开启网络请求线程（这一部分可以展开浏览器的机制以及进程与线程之间的关系）
2. 开启网络线程到发出一个完整的http请求（这一部分涉及到dns查询，tcp/ip请求，五层因特网协议栈等知识）
3. 从服务器接收到请求到对应后台接收到请求（这一部分可能涉及到负载均衡，安全拦截以及后台内部的处理等等）(后端相关概念不会不熟)
4. 后台和前台的http交互（这一部分包括http头部、响应码、报文结构、cookie等知识，可以提下静态资源的cookie优化【就是把静态资源放到别的子域名下之类的避免请求带上cookies】，以及编码解码，如gzip压缩等）单独拎出来的缓存问题，http的缓存（这部分包括http缓存头部，etag，catch-control等）
6. 浏览器接收到http数据包后的解析流程（解析html-词法分析然后解析成dom树、解析css生成css规则树、合并成render树，然后layout、painting渲染、复合图层的合成、GPU绘制、外链资源的处理、loaded和domcontentloaded等）
7. CSS的可视化格式模型（元素的渲染规则，如包含块，控制框，BFC，IFC等概念）
8. JS引擎解析过程（JS的解释阶段，预处理阶段，执行阶段生成执行上下文，VO，作用域链、回收机制等等）



### 浏览器是多进程的

- Browser进程：浏览器主进程（负责协调）
- 第三方插件进程：就是扩展程序的进程
- GPU进程：用于3D绘制
- 浏览器渲染进程：默认每个tab一个进程。互不影响，控制页面渲染和脚本执行，事件处理（多个空白的tab会合成为一个渲染进程）



**浏览器渲染进程又包括多个线程**

- GUI线程
- JS引擎线程
- 事件触发线程
- 定时器线程
- 网络请求线程



### DNS查询

- 先从浏览器缓存找，找不到则从本机缓存找，再没有的话就是用host。
- 如果本地没有缓存就会向DNS域名服务器查询（中间经过的路由器可能也有缓存）



### TCP/IP请求

浏览器对同一域名下的并发TCP连接是有限制的（2-10个），一般为6个。



**get和post的区别**

规范上来说 ，get会产生一个TCP数据包，post会产生两个TCP数据包

- get请求时，浏览器会把 `headers`和 `data`一起发送出去，服务器响应200（返回数据）
- post请求时，浏览器先发送 `headers`，并且在请求头带上`Expect: 100-continue`，服务器响应 `100  continue`，浏览器再发送 `data`，服务器响应200（返回数据）

> 当然这只是规范层面上的区别，具体实现上很多时候对于post请求都是直接一起发送然后返回数据的。



###http交互

#### http报文结构

>  请求和响应报文都有**开始行**、**首部行**、**实体主体**

请求报文：

![](E:\myGit\prepare-for-interview\JavaScript\img\20170417103005064.jpg)



响应报文：

![](E:\myGit\prepare-for-interview\JavaScript\img\20170417102928111.jpg)

#### http方法

- HTTP1.0定义了三种请求方法： GET, POST 和 HEAD方法。
- HTTP1.1新增了五种请求方法：OPTIONS, PUT, DELETE, TRACE 和 CONNECT 方法。



#### http状态码

- 1xx：指示信息，表示请求已接收，继续处理
- 2xx：成功，表示请求已被成功接收、理解、接受
- 3xx：重定向，要完成请求必须进行更进一步的操作
- 4xx：客户端错误，请求有语法错误或请求无法实现
- 5xx：服务器端错误，服务器未能实现合法的请求



#### http常见头部

**请求头：**

- Accept: 接收类型，表示浏览器支持的MIME类型（对标服务端返回的Content-Type）
- Accept-Encoding：浏览器支持的压缩类型,如gzip等,超出类型不能接收
- Content-Type：客户端发送出去实体内容的类型
- Cache-Control: 指定请求和响应遵循的缓存机制，如no-cache
- If-Modified-Since：对应服务端的Last-Modified，用来匹配看文件是否变动，只能精确到1s之内，http1.0中
- Expires：缓存控制，在这个时间内不会请求，直接使用缓存，http1.0，而且是服务端时间
- Max-age：代表资源在本地缓存多少秒，有效时间内不会请求，而是使用缓存，http1.1中
- If-None-Match：对应服务端的ETag，用来匹配文件内容是否改变（非常精确），http1.1中
- Cookie：有cookie并且同域访问时会自动带上
- Connection：当浏览器与服务器通信时对于长连接如何进行处理,如keep-alive
- Host：请求的服务器URL
- Origin：最初的请求是从哪里发起的（只会精确到端口）,Origin比Referer更尊重隐私
- Referer：该页面的来源URL(适用于所有类型的请求，会精确到详细页面地址，csrf拦截常用到这个字段)
- User-Agent：用户客户端的一些必要信息，如UA头部等



**响应头**：

- Access-Control-Allow-Headers: 服务器端允许的请求Headers
- Access-Control-Allow-Methods: 服务器端允许的请求方法
- Access-Control-Allow-Origin: 服务器端允许的请求Origin头部（譬如为*）
- Content-Type：服务端返回的实体内容的类型
- Date：数据从服务器发送的时间
- Cache-Control：告诉浏览器或其他客户，什么环境可以安全的缓存文档
- Last-Modified：请求资源的最后修改时间
- Expires：应该在什么时候认为文档已经过期,从而不再缓存它
- Max-age：客户端的本地资源应该缓存多少秒，开启了Cache-Control后有效
- ETag：请求变量的实体标签的当前值
- Set-Cookie：设置和页面关联的cookie，服务器通过这个头部把cookie传给客户端
- Keep-Alive：如果客户端有keep-alive，服务端也会有响应（如timeout=38）
- Server：服务器的一些相关信息



#### cookie的优化

- 客户端在域名A下有cookie（这个可以是登陆时由服务端写入的）
- 然后在域名A下有一个页面，页面中有很多依赖的静态资源（都是域名A的，譬如有20个静态资源）
- 此时就有一个问题，页面加载，请求这些静态资源时，浏览器会默认带上cookie
- 也就是说，这20个静态资源的http请求，每一个都得带上cookie，而实际上静态资源并不需要cookie验证
- 此时就造成了较为严重的浪费，而且也降低了访问速度（因为内容更多了）

> 解决方案：将静态资源分组，分别放到不同的子域名下，这样请求便不会带上cookie



#### gzip压缩

通过把CSS/JS这种文件进行gzip压缩使传输速度更快。

有两种方式

- 服务端响应请求时候压缩：可以通过`nginx`开启压缩配置，或者在我们的node服务器中使用对应的类似[compression](https://github.com/expressjs/compression) 中间件进行响应时压缩。
- 构建应用时直接压缩：通过引入`webpack`的[compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin)在打包文件的时候同时打包压缩版本。配合`express`的[express-static-gzip](https://github.com/tkoenig89/express-static-gzip)或者配合`Koa`的`koa-static`（这个中间件默认自带对.gz文件的检测）



### http缓存

> 缓存可以简单的划分成两种类型： `强缓存`（ `200fromcache`）与 `协商缓存`（ `304`）。

**http1.0中的缓存控制：**

- `Expires`：服务端配置的，属于强缓存
- `If-Modified-Since/Last-Modified`：这两个是成对出现的，属于协商缓存

**http1.1中的缓存控制：**

- `Cache-Control`：缓存控制头部，有no-cache、max-age等多种取值。属于强缓存
- `If-None-Match/E-tag`：这两个是成对出现的，属于协商缓存。和Last-Modified不同，E-tag更精确，它是类似于指纹一样的东西，基于 `FileEtagINodeMtimeSize`生成

> `Expires`使用的是服务器端的时间，但是有时候会有这样一种情况-客户端时间和服务端不同步。那这样，可能就会出问题了，造成了浏览器本地的缓存无用或者一直无法过期，所以一般http1.1后不推荐使用 `Expires`



### 解析页面

1. 解析HTML，构建DOM树
2. 解析CSS，生成CSS规则树
3. 合并DOM树和CSS规则，生成render树
4. 布局render树（Layout/reflow），负责各元素尺寸、位置的计算
5. 绘制render树（paint），绘制页面像素信息
6. 浏览器会将各层的信息发送给GPU，GPU会将各层合成（composite），显示在屏幕上