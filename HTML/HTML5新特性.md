### HTML5新特性

#### 新特性

- 语义化：增加了诸多的标签，让开发者更容易表达html的语义。比如`<section>` `<aside>` `<header>`等；引入的一些新的表单控件，这些控件具有更为精准的UI呈现。
- 通信：引入WebSockets，使得网页也具有了与服务器进行双工通信的能力
- 离线&缓存：支持一些简单的客户端存储和数据库，实现客户端存储，以前通常用cookie；离线应用功能可以使得应用可以离线运行
- 多媒体呈现：音视频呈现能力增强，引入`<audio>` `<video>`，可以嵌入字幕
- 2D/3D绘图&效果：Canvas绘图、WebGL的3D渲染支持、SVG
- 性能提升：XMLHttpRequest的增强，Web异步任务能力，历史接口(History API)，拖拽的原生支持
- 设备访问：访问相机、地理位置、设备角度等



#### 注意得比较少的新颖API

##### 历史接口(History API)

允许对浏览器历史记录进行操作。这对于那些交互地加载新信息的页面尤其有用。

HTML5 引进了 `history.pushState()` 方法和 `history.replaceState()` 方法，允许逐条地添加和修改历史记录条目



##### 拖拽的原生支持

HTML5 提供了原生的拖放 API，对于被拖动元素，会有以下三个事件发生

- dragstart 按下鼠并开始移动鼠标时触发
- drag 拖动时持续触发
- dragend 拖动结束将得到dragend事件对象，不管操作成功与否

而对于放置目标

- dragenter 拖动元素第一次进入放置目标时触发
- dragover 在放置目标内移动
- dragleave 拖出了放置目标时触发
- drop 放置在目标范围内

只要重写一个元素的 dragenter 和 dragover 事件，就可以使它变成一个有效的放置目标



##### 使用地理位置定位

 让浏览器使用地理位置服务定位用户的位置。

HTML5 提供的地理位置 API 即是 geolocation 对象， 其位于 navigator，通过 navigator.geolocation 调用。

- 获取当前位置 最常用的方法就是 `getCurrentPosition()` 了，通过调用这个函数获取用户当前定位位置。这个方法接受两个参数：第一个是成功的处理函数，第二个则是出现错误的处理函数（可选）。

```
navigator.geolocation.getCurrentPosition(success[, error]);
```

- 监视定位 可以通过 `watchPosition()` 函数实现该功能。它与 `getCurrentPosition()` 接受相同的参数，但回调函数会被调用多次。

```
var watchID = navigator.geolocation.watchPosition(success[, error]);
```

如果成功，则回调函数会传入一个 position 参数：包含两个属性 `coords` 和 `timestamp`。 其中 `coords` 包含

- latitude 纬度
- longitude 经度
- altitude 海拔
- heading 度(顺时针，以正北为基准)
- speed 米/秒