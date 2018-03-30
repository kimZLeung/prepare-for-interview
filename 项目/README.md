### 关于项目

- 优化：
  - 结合`webpack`进行第三方库的代码分离，进行异步路由的优化，Koa自己搭建静态文件服务器进行前后端分离部署，结合中间件实现打包出来的Gzip压缩文件（JS，CSS，HTML）的返回。
  - 利用设置HTTP响应头的形式，通过结合`koa-static-cache`中间件实现静态资源的缓存。
    - koa-static-cache有选项`gzip`可以直接用于返回时进行gzip压缩，也有`usePrecompiledGzip`用于优先返回已压缩好的文件
- 业务：
  - 封装axios作为统一代理的网络请求，统一拦截所有项目相关请求，统一处理错误和权限验证跳转。
  - 封装Dialog组件，用于统一展示增改表单。通过高阶组件的形式，把Dialog的显示隐藏等属性统一在高阶组件内封装
  - 根据策略模式统一封装表单验证的接口，通过`mixins`加入各个需要表单验证的组件中，无需在各个表单组件中重复定义表单验证的逻辑
  - React可以用高阶组件实现抽象表单验证这样的功能
  - 全局封装提示组件，把配置状态放到`Vuex`中进行管理
  - 通过`Koa`配合`MockJS`，进行开发过程中后端数据模拟
- 架构：
  - 尝试通过Koa+webpack进行热部署开发环境搭建，引入MockJS配合Koa-Router进行后端数据模拟。开发环境下利用`koa-webpack-dev-middleware`配合`koa-webpack-hot-middleware`进行热部署开发



- 封装Axios

  > 目的是为了方便使用GET和POST

  - 一开始就无法请求，少了`withCredentials`
  - 通过POST发送的数据未经处理
  - 后来为了适应图片上传加入`formData`
  - 通过全局处理预先做一些错误的处理提示

  ​

- Vue组件之间的数据交流

  - 本来使用Element应该开发效率挺快的
  - 但是数据保存在不同组件中，会变得越来越难以处理
  - 所以统一决定把数据保存到最上层的容器组件内，通过props往下传，通过事件回调触发数据更新
  - 然后需要全局保存的一些数据和状态则保存到Vuex里面，尽量减小Vuex的大小



- websocket
  - 本来用原生的API
  - 后来引入SockJS，兼容不同的浏览器



- 通过webpack的code splitting配合Vue的异步组件实现异步路由JS文件延迟加载