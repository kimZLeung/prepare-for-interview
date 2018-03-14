## CORS的两种请求

---

> CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）

CORS需要浏览器和服务器同时支持，前端的同学可能认为跟同源请求时发送的请求一样，关键是服务器需要在返回的时候添加一些响应头。

但是其实并不一样，CORS的AJAX请求和同源的AJAX请求不一样。浏览器将CORS的AJAX请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）

### 简单请求

> 简单请求满足以下两个条件

- 请求方法使用的是`GET`，`POST`，`HEAD`
- 请求头不超出以下：
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

同时满足以上两个条件的就是简单请求。

简单请求也的确和普通的同源AJAX请求没有很大区别。具体流程是

会自动在请求时多加一个`Origin`头部，用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

然后请求到了服务端，服务端通过判断这个`Origin`头部，如果不在许可范围内
，则正常返回HTTP响应，但是不会返回`Access-Control-Allow-Origin`头部。浏览器通过判断是否有这个头部来决定是否拦截这次的响应。

如果在许可范围内，则返回的响应，会多出几个头信息字段。

``` javascript
Access-Control-Allow-Origin: 'xxx'
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: xxx
Content-Type: text/html; charset=utf-8
```

> 需要注意的是Access-Control-Expose-Headers是用于getResponseHeader()方法所能获得的额外信息。

### 非简单请求

对于非简单请求，在发送正式请求之前，浏览器会先发送一次预请求来进行判断。相当于要先：浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段

**以下是预请求的具体流程：**

比较值得注意的是预请求使用的方法是`OPTIONS`，表示这个请求是用来询问的。

而且预请求除了也有`Origin`头部之外会有两个特殊的头部，分别是`Access-Control-Request-Method`和`Access-Control-Request-Headers`

- Access-Control-Request-Method：value传的是当前将要请求使用的方法
- Access-Control-Request-Headers：该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段

预请求发送过去之后，服务器会检查`Origin`，`Access-Control-Request-Method`和`Access-Control-Request-Headers`三个头部，并且对照自己设定的`Access-Control-Allow-Origin`，`Access-Control-Request-Methods`和`Access-Control-Request-Headers`来判断是否可以响应后续请求。

如果不可以，则正常返回，但是没有任何CORS相关的头信息字段，将使浏览器意识到预请求失败，进而不继续后续请求

如果可以，同时这一次的预响应也会带有对应的`CORS`响应头

```js
// cors响应头
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: xxx
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 172800
```

预请求成功之后，将会开始非简单请求的正常请求阶段。后续的请求会和简单请求一样。也是请求头带有`Origin`，响应头带有`Access-Control-Allow-Origin`和一些可选的`Access-Control-Allow-Credentials`之类的。
