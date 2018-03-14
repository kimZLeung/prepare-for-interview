## 关于URL编码

### URL只允许存在ASCII

> URL是采用[ASCII](http://en.wikipedia.org/wiki/ASCII)字符集进行编码的，所以如果URL中含有非[ASCII](http://en.wikipedia.org/wiki/ASCII)字符集中的字符，那就需要对其进行编码。再者，由于URL中好多字符是保留字，他们在URL中具有特殊的含义。如“&”表示参数分隔符，如果想要在URL中使用这些保留字，那就得对他们进行编码。

官方编码规范：对URL中属于[ASCII](http://en.wikipedia.org/wiki/ASCII)字符集的非保留字不做编码；对URL中的保留字需要取其[ASCII](http://en.wikipedia.org/wiki/ASCII)内码，然后加上“%”前缀将该字符进行替换（编码）；对于URL中的非[ASCII](http://en.wikipedia.org/wiki/ASCII)字符需要取其[Unicode](https://en.wikipedia.org/wiki/Unicode)内码，然后加上“%”前缀将该字符进行替换（编码）。



### 各种浏览器对不同URL编码方法的差异

- 对于URL路径里包含汉字：统一采用utf-8编码。
- 新开页面中的查询字符串的编码，用的是操作系统的默认编码。
- GET和POST方法提交表单返回的页面的URL的编码，用的是原先网页通过`meta`标签指定的编码。（form标记中有一个`accept-charset`属性，将其赋值后表单会按照这个值表示的编码方式进行提交）
- Ajax调用的URL包含汉字等非ASCII字符时，IE总是采用GB2312编码（操作系统的默认编码），而Firefox总是采用utf-8编码。

（借鉴阮一峰老师的结论，在网上看到了Ajax对于URL的编码有不同[说法](http://www.cnblogs.com/wangfengpaopao/p/3224820.html)，不知实际如何，但使用Ajax访问带有非ASCII字符的URL时，最好先在JS进行统一编码，从而简化服务器解码的复杂度）



### JS的编码方法

- `window.encodeURI`：对整个URL进行编码，对于URL中的一些保留字（如`&`和`?`）不进行编码
- `window.encodeURIComponent`：对URL进行部分编码，对于这些保留字也会进行编码，所以需要对URL分段传入进行调用

> encodeURI(Component)  一般用在 URI 上，但是不是一定就要用在 URL 上。比如如果 POST 请求的 Request Header 中 Content-Type 为「application/x-www-form-urlencoded」， 那么 Request Payload 里面的数据一般就是使用 encodeURI(Component) 编码的。（和 URL 的 querystring 一样）。