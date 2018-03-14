## serviceWorker

---

### serviceWorker能做什么

> `serviceWorker`和`webWorker`一样，也属于`worker`，也是工作于后台的独立线程，工作的环境也和普通的JS不同，并不能直接参与DOM的交互，但是`serviceWorker`给浏览器提供了很多诸如：网络代理，转发请求，伪造响应，离线缓存，消息推送的功能，也可以通过postMessage与页面之间通信。但是目前它首先要具备的功能是拦截和处理网络请求，包括可编程的响应缓存管理。

也就是说`serviceWorker`的主要功能是：对资源进行客户端缓存并且，离线状态下可以通过请求的代理模拟响应，将静态资源返回。

---

### serviceWorker的生命周期

要使用`serviceWorker`，先要清楚它的生命周期。`serviceWorker`的生命周期可以分为：

- 安装：这个阶段可以监听`install`事件，通过`event.waitUntil`来做一些比如`cache.open('my-cache')`之类的启用缓存的操作
- 激活：也可以使用`event.waitUntil`
- 监听fetch和message事件：通过`event.respondWith`进行模拟响应
- 销毁

在外面的JS中注册`registor`上`serviceWorker`之后，可以在对应的`serviceWorker`文件(sw.js)里面通过以上的生命周期来做缓存，然后代理`fetch`的请求，达到离线缓存静态资源的目的。

> 用户首次访问`serviceWorker`控制的网站或页面时，`serviceWorker`会立刻被下载。之后至少每24小时它会被下载一次。它**可能**被更频繁地下载，不过每24小时一定会被下载一次，以避免不良脚本长时间生效。

---

### example

``` javascript
// 在外部简单注册一个serviceWorker(文件名为service-worker.js)
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
        console.log('service worker 注册成功');
    }).catch(function (err) {
        console.log('servcie worker 注册失败')
    });
}
```

``` javascript
// service-worker.js

var CACHE_NAME = 'kim-cache'
var cacheList = [
	'/',
	'/static/css/index.css'
	'/static/js/index.js'
	'/static/img/logo.png'
]

self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
				console.log('open cache')
				return cache.addAll(cacheList)
			})
	)
})

// 代理网络请求，其实相当于给每一次请求加一次过滤，检查是否命中cache
self.addEventListener('fetch', function(e) {
	e.respondWith(
		// 检查缓存中是否有其请求的静态资源
		caches.match(evt.request).then(function(response) {
			// 有则直接返回
            if (response) {
                return response;
            }
            // 如果没有，则拿出这个请求
            var request = evt.request.clone();
            // 通过fetch去请求这个东西
            return fetch(request).then(function (response) {
            	// 这里进行判断，如果返回是图片类型的资源的话则加入缓存
                if (!response && response.status !== 200 && !response.headers.get('Content-type').match(/image/)) {
                    return response;
                }
                var responseClone = response.clone();
                caches.open('my-test-cache-v1').then(function (cache) {
                	// put和add的区别是：put不进行请求，直接把request和response传入
                    cache.put(evt.request, responseClone);
                });
                return response;
            });
        })
	)
})

```

---

### 效果

然后我们可以尝试把本来的静态资源服务器关掉。

然后再次访问这个端口，然后其实通过网络请求的话，服务器其实无法响应到资源，但是因为我们通过`serviceWorker`对资源进行了缓存，并且代理了每一次的网络请求，所以当我们去请求缓存好的的资源的时候，`serviceWorker`会直接进行返回。从而省去请求的时间。

通过`serviceWorker`进行模拟响应的返回的资源，可以在控制台的`network`里面看到，200 OK (from ServiceWorker)的状态，而`service-worker.js`可以看到200 OK (from disk cache)的状态。

我们也可以通过控制台的`application`里面的`Cache Storage`里面找到刚刚新开的`Cache`。

`Cache`里面对应有我们刚刚缓存好的资源

> 借用一个总结：`serviceWorker`的缓存机制是 install时fetch需要缓存的文件，用cache.addAll缓存到cacheStorage里。在fetch事件触发时，先cache.match这些缓存，若存在则直接返回，若不存在则用fetch抓这个request，然后在cache.put进缓存。

---

### 不好的地方

`serviceWorker`很顽强，一个新的`serviceWorker`install之后不能直接active，需要等到所有使用这个`serviceWorker`的页面都卸载之后能替换，不利于调试

一个能卸载掉`serviceWorker`的方法

- `chrome://inspect/#service-workers`中terminate相应的service worker
- `chrome://serviceworker-internals/`中unregister相应的service worker
- 关闭后再打开页面

---

### 更新

如果修改了`service-worker.js`的JS文件，则会更新`serviceWorker`，重新开始install。当然向上面所说的，更新了文件之后，你会想去删除掉以往通过动态加入进`Cache Storage`的一些东西。所以我们可以在新的`serviceWorker`的`activate`事件里面进行清除。

``` javascript
self.addEventListener('activate', function(e) {
	var whiteList = ['my-cache', 'kim-cache']

	event.waitUntil(
		// caches.keys()得到键的数组
		caches.keys().then(function(cacheNames) {
			// 返回Promise对象
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if(whiteList.indexOf(cacheName) === -1) {
						return caches.delete(cacheName)
					}
				})
			)
		})
	)

})
```

这样做可以在新的`serviceWorker`在install完activate的时候，对白名单以外的缓存进行删除。相当于reset了一次`Cache Storage`


---

### API

#### caches

- caches.keys()
- caches.open()
- caches.match()
- caches.delete()

cache实例方法

- cache.add()
- cache.put()
- cache.addAll()

#### self (相当于这个`serviceWorker`)

#### event

- event.waitUntil()
- event.respondWith()

