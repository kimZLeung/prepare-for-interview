# WebStorage && Cookie && Session

---

## Cookie 和 Session

Session并不是sessionStorage。简单来说，Session是保存在服务端的，而Cookie是保存在客户端的。

最起初的时候，大佬说想直接在浏览器端弄一个缓存，保存一下这个页面需要经常使用到的数据，为了不每次都请求一遍。所以产生了Cookie，用来保存一些简单的数据。

后来大佬发现把部分信息都保存在客户端的Cookie里面并不是太安全，所以产生了Session。服务端的Session也是用来跟踪保存用户状态，但是每个Session是对应一个用户，也就是对应一个会话的，而这个对应关系，大佬决定用Cookie来实现，于是产生了另一种做法：在Cookie中保存SessionId，然后通过这个SessionId在服务端访问对应的Session来获取用户数据。比较私密的用户数据可以存Session

> Cookie: Cookie的数据始终会在**同源**的HTTP请求中携带，所以它会一直在浏览器和服务器直接来回传递。

其实从根本上来说，`Cookie`之所以会始终在**同源的HTTP**请求中携带，是因为同源的请求不需要客户端和服务端同时允许才能在请求过程中携带`Cookie`，而跨域的CORS请求需要`withCredentials: true`和`Access-Control-Allow-Credentials: true`才能使请求上带有`Cookie`。说得有点多，换句话来讲，就是`Cookie`都有作用域，由它的`domain`和`path`来决定，也就是，`Cookie`的这个作用域决定了它在什么请求上会被携带。

所以我们可以想象，同源的`Cookie`的作用域就是本域，所以同源的请求会携带同源的`Cookie`，而且HTTP不会阻止`Cookie`被携带。而跨域的情况下，虽然跨域的`Cookie`会有作用域，但是由于种种限制，所以需要做出一点设置才能被携带上。

> 通过`document.cookie`的方式只能访问到同源的`cookie`，也就是第一方Cookie。


更多[`Cookie`资料](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)

---

## Cookie 和 WebStorage

WebStorage包含了localStorage 和 sessionStorage

前面提到Cookies有缓存数据和追踪用户状态的作用，而WebStorage的作用大多数缓存数据，那 Cookies 和 WebStorage具体有什么不同呢

- 前面也提到，cookie数据始终在**同源**的http请求中携带，而WebStorage的数据**仅仅会在客户端中保存**，并不会自动把数据传过去服务器。
- 因为WebStorage的数据不会传到服务端，所以它和Cookies的存储大小的限制不同。cookie 数据不能超过**4k**，sessionStorage和 localStorage可以达到**5M**左右。
- **数据有效期不同。**cookie在设置的有效期（服务端设置）内有效，不管窗口或者浏览器是否关闭。sessionStroage仅在当前浏览器窗口（更贴切的说是当前的标签）关闭前有效（也就是说只要这个浏览器标签没有关闭，即使刷新页面，数据仍然存在。关闭窗口后，sessionStorage即被销毁）；localStroage始终有效，窗口或者浏览器关闭也一直保存
- **作用域不同。**sessionStorage不在不同的浏览器**窗口**中共享，即使是同一个页面（就是说在同一标签页中，就算进行页面跳转，sessionStorage里面的数据也不会被消除，但是如果是不同的两个标签页的话就不会共享sessionStorage里面的数据，即使是同源，即使是同一个页面）；localStorage 在所有同源窗口中都是共享的**localstorage是无法跨域的，也无法让子域名继承父域名的localstorage数据**；cookie 也是在所有同源窗口中都是共享的。
- localStorage不支持过期时间的设置，我们可以通过手动封装加入过期时间的处理。
- localStorage支持事件通知机制，可以将数据更新的通知发送给监听者，注意：很容易犯的错误是，在同一个网页修改本地存储，又在同一个网页监听，这样是没有效果的。这个监听是提供给同源的不同页面进行`storage`监听的

```js
window.addEventListener('storage', function (e) {
	alert(e.newValue)
})
```

WebStorage的优点

- **临时存储数据**： 对于某些常用数据，或者静态资源数据，可以临时存储。对于当前窗口(tab)的临时数据可以利用 sessionStorage 来保存，如果是长期保存，则使用 localStorage
- **减少网络流量**：数据保存在本地，避免重新向服务器请求数据，从而避免了不必要的数据请求，因此减少网络流量
- **快速显示数据**：由于数据临时保存在本地，从而不用发送请求去服务器端获取，这样可以快速的读取数据，提供了性能

