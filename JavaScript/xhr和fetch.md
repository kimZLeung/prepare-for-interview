## XMLHttpRequest

---

之前也很少尝试过直接使用原生的`xhr`对象去做网络请求，对于网络请求的掌握也只是基本会向后台请求数据，一知半解，这里来总结一下

---

``` javascript
var xhr = new XMLHttpRequest()
xhr.open('GET', url)
xhr.responseType = 'json'

// 比较新的onload事件
xhr.onload = function() {
  console.log(xhr.response)
}

// 比较旧的监听onreadystatechange事件
xhr.onreadystatechange=function() {
    if (xhr.readyState==4 && xhr.status==200)
    {
        console.log(xhr.responseText)
    }
}

xhr.onerror = function() {
  console.log("Oops, error")
}

xhr.send()
```

创建对象之后，可以通过`xhr`对象上提供的很多接口来进行网络请求。

### setRequestHeader

我们可以通过`xhr.setRequestHeader(header, value)`来进行请求头的修改或者增加。

> 需要注意的是：`Content-Type`的默认值与具体发送的数据类型有关

比如：

- 如果data是 Document 类型，同时也是HTML Document类型，则content-type默认值为text/html;charset=UTF-8;否则为application/xml;charset=UTF-8
- 如果data是 DOMString 类型，content-type默认值为text/plain;charset=UTF-8；
- 如果data是 FormData 类型，content-type默认值为multipart/form-data; boundary=[xxx]
- 如果data是其他类型，则不会设置content-type的默认值

> 也就是说传不同类型的参数的时候，`content-type`的默认值也会不一样。不过我们也可以显示使用`xhr.setRequestHeader`来修改请求的`content-type`头部

### getAllResponseHeaders和getResponseHeader

> getAllResponseHeaders()返回所有头部，getResponseHeader(header)传入header的key获取对应头部的值

调用这两个方法来获取头部的时候，因为浏览器安全限制，只能获取到`simple response header`：Cache-Control,Content-Language,Content-Type,Expires,Last-Modified,Pragma;
和`Access-Control-Expose-Headers`

### xhr.responseType

这个属性用于过滤返回结果，可以让我们直接通过`xhr.response`获得对应的数据类型

> 可以为`xhr.responseType`指定的值有："", "text", "document", "json", "blob", "arrayBuffer"

设置之后可以直接在`xhr.response`获得对应的数据类型

### xhr.onprocess和xhr.upload.onprocess

`xhr.onprocess`：用于添加显示下载进度的回调
`xhr.upload.onprocess`：用于添加显示上传进度的回调

### xhr.withCredentials

> 我们都知道，在发同域请求时，浏览器会将cookie自动加在request header中。但大家是否遇到过这样的场景：在发送跨域请求时，cookie并没有自动加在request header中。

`xhr.withCredentials`开启后才能在跨域请求中做带有`cookies`的处理（同时服务端也需要设置`Access-Control-Allow-Credentials: true`）

在客户端设置`xhr.withCredentials`为`true`表示允许客户端接受服务端返回的`cookies`并且在客户端做对应的处理。默认为`false`

> 不过需要注意的是：如果跨域的请求带有`cookies`认证信息的话，`Access-Control-Allow-Origin`就不能设为星号，必须指定明确的、与请求网页一致的域名。不然请求依然会报错。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的`document.cookie`也无法读取服务器域名下的Cookie。

---

## fetch

```js
var h = new Headers()
h.append('Content-Type', 'text/plain')
 
var option = {
	method: 'GET',
    headers: h,
    credentials: 'include'	// 允许接受和发送cookies
}
if (fetch) {
	fetch(url, option)
    .then((res) => {
        if (res.ok) {
			console.log(res)
        }
    })
    .catch((err) => {
    	console.log(err.message)
    })
}
```

因为返回一个`Promise`对象，所以`fetch`API比较好用

但是需要注意的是：

- 如果遇到网络故障，[`fetch()`](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch) promise 将会 reject，带上一个 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 对象。但是遇到404等网络响应正常，但服务器不能返回资源或者错误的情况下：想要精确的判断 `fetch()` 是否成功，需要包含 promise resolved 的情况，此时再判断 [`Response.ok`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response/ok) 是不是为 true。
- 默认情况下, `fetch` **不会从服务端发送或接收任何 cookies**，要发送 cookies，必须设置 [credentials](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch#%E5%8F%82%E6%95%B0) 选项，即`fetch(url, {credentials: 'include'})`



```js
// fetch api 
fetch('some/api/data.json', {
  method:'POST', //请求类型 GET、POST
  headers:{}, // 请求的头信息，形式为 Headers 对象或 ByteString
  body:{}, //请求发送的数据 blob、BufferSource、FormData、URLSearchParams（get 或head 方法中不能包含 body）
  mode:'', //请求的模式，是否跨域等，如 cors、 no-cors 或 same-origin
  credentials:'', //cookie 的跨域策略，如 omit、same-origin 或 include
  cache:'', //请求的 cache 模式: default、no-store、reload、no-cache、 force-cache 或 only-if-cached
}).then(function(response) { ... })
```



### Fetch 实现了四个接口

> Fetch 实现了四个接口：GlobalFetch、Headers、Request 和 Response。GloabaFetch 就只包含了一个 `fetch` 方法用于获取网络资源，其它三个直接对应了相应的 HTTP 概念。此外，在 request/reponse 中，还混淆了 Body。



### Header

可以通过`new Headers()`创建出来。一个 Headers 对象是一个简单的多名值对。Headers提供了`set`、`get`、`delete`、`append`等接口可以允许调用。

> 出于安全原因，有些 header 字段的设置仅能通过 User Agent 实现，不能通过编程设置（比如说Origin头部）

```js
var h = new Headers()
h.append('content-type', 'text/plain')
h.has('content-type') 	//true
h.set('content-type', 'text/html')
h.get('content-type')	// text/html
```



### Request

可以通过`new Request(url)`创建，url必须传入，第二个参数为`option`，和`fetch`的第二个参数同义

```js
var myHeaders = new Headers()

var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' ,
               credentials: true
             }

var myRequest = new Request('flowers.jpg')

fetch(myRequest,myInit)
.then(function(response) {
  return response.blob()
})
.then(function(myBlob) {
  var objectURL = URL.createObjectURL(myBlob);
  myImage.src = objectURL;
})
```

创建一个`Request`对象可直接传入fetch第一个参数



### Response

`Response`实例是在 fentch() 处理完 promises 之后返回的，是then的resolve函数的参数。`Response`可以被创建，但只有在 ServiceWorkers 中才真正有用。（用于劫持fetch并且匹配缓存返回资源）

> Response() 构造方法接受两个可选参数—response的数据体和一个初始化对象`option`

`Response`用得比较多的是用于验证返回的属性：

- Response.status — 整数(默认值为200) 为response的状态码.
- Response.statusText — 字符串(默认值为"OK"),该值与HTTP状态码消息对应.
- Response.ok — 如上所示, 该属性是来检查response的状态是否在200-299(包括200,299)这个范围内.该属性返回一个Boolean值.
- Response.headers — 响应头



### body的处理

`Request`和`Response`都实现了body接口，就是请求体和响应体，对于body，有以下可以用于处理的方法：

- arrayBuffer()
- blob()
- json()
- text()
- formData()

> 这些方法返回Promise对象，可以直接return出来在下一个then接受结果数据