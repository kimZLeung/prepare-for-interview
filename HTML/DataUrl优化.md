## DataUrl

---

有时候我们会看到`<img src="data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAF..." />`这种url，我们一般会看到的url是`<img src="/static/img/logo.png" />`

那么dataUrl和这种外链url有什么区别呢？

> 在DataUrl中，data表示获得数据的协定名称，然后后面跟着的就是`type`，base64是数据的编码方式，表示后面跟着的这串编码就是base64编码过来的。

说了一堆到底DataUrl有什么用呢。其实，如果我们用外链url，我们的浏览器会向服务器发送一个请求，发送到这个url，并且从服务器把图片返回。而如果使用DataUrl的话，并不会向服务器发送请求，因为本身的文件内容就已经通过base64编码后放在HTML或者CSS里面了。也就是说DataUrl可以把文件直接内联在HTML或者CSS里面，这样的话会减少网络请求，并且增加图片下载速度。

当然，涉及到内联的话，编码后文件体积会不会过大，让HTML的体积也随之增大，这个问题就变得严重起来了。所以这个优化在图片文件过大这方面来说都是有弊的。而且通过Base64编码的数据体积通常是原数据的体积4/3。所以我们最好只把文件体积小的文件使用都dataUrl内联到文件里。

---

其实`webpack`的`url-loader`有类似的应用，`url-loader`可以实现图片的加载引入，它的配置项有一个`limit`值，指定最大的文件限制，若`require`的这个文件超出大小限制，将会使用外链url引入文件，若这个文件不超出大小限制，则内联为dataUrl形式

也就是说：`url-loader`的本意是把文件修改为`dataUrl`形式内联到依赖文件中，但是它内部集成了`file-loader`，并且在文件大小超出限制的时候，会使用`file-loader`将外部文件引入
