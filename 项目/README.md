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