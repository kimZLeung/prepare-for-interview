# Webpack

标签（空格分隔）： webpack 模块化 打包工具

---

  1. 打包工具
  2. 模块加载工具
  3. 各种资源可以当做模块处理


----------
## 如今的JS模块化组织的方法。

  1. AMD或者CMD。也就是require和sea (异步加载模块)
  2. common。Node使用commonJS来进行模块化 (同步加载模块)
  3. ES6的模块化，的确好用。 (有生命的模块)
  4. webpack咯~browserify咯


----------
## 优势
- webpack有大量的加载器可以加载不同的文件，加载css和图片还有jsx都可以（jsx...）
- 有丰富的插件。
- 分模块按需加载的能力
- 支持 React 热插拔
- 讲真webpack可以支持AMD和commonJS，browserify只支持commonJS？(听说是...GG)

----------
## webpack和gulp、grunt的比较
- Gulp和Grunt也是在项目中写一个配置文件。指明Gulp和Grunt对项目文件的操作（编译，组合，压缩等操作）然后运行这个工具进行对文件的压缩
- 但是webpack的工作方式并不是这样的。
- webpack会通过loaders来处理文件之间的相互依赖（因为webpack提供了模块化的管理模式）实现按需加载。最后会打包成一个JS文件（Bundled.js）

---
## webpack的externals

- externals对象可以实现不把一些外部库也打包进来时用的（因为JQ之类的库打包一次特久）
- 所以我们可以这样做

        //webpack.config.js
        module.exports = {
            externals: {
              'react': 'React' // 前面的那个键是供别的模块引入的时候用的
            },
            //...
        }


        // app.html
        // ...
        <script src="react.min.js" />
        <script src="bundle.js" />


        // 某个被打包的模块
        // commonJS
        var react = require('react');
        // ES6
        import react from 'react';

---
## 自动挂载插件 ProvidePlugin
- 上面这个externals配置属性可以不把externals的东西不打包进来bundle.js里面
- 区别于这个，这个插件的作用是这样用的

        // webpack.config.js
        module.exports = {
            plugins:[{
                 $: "jquery",
            }],
            // ...
        }
        
        // a.js (随便一个模块)
        // 不需要 var $ = require('./../../xxoo');  直接用
        
        $('xxoo').html('<h1>Hello 世界</h1>');

- jq依旧会打包进去。

---

## 各种loaders

- babel-loader: 用于`webapck`配合`babel`做各种工作，包括转化`JSX`语法，转化`ES6`语法等，可以配合`.babelrc`使用
- css-loader: 用于加载`css`文件
- style-loader: 用于把加载好的`css`代码转化成内联的样式，配合`css-loader`使用
- sass-loader，less-loader: 用于将各种`scss`和`less`文件转化为`css`，可以配合`css-loader`和`style-loader`使用
- vue-loader: `Vue`的loader，用于载入`.vue`的单文件组件
- file-loader: 用于载入文件（图片，字体等）
- url-loader: 和`file-loader`差不多，用于载入文件，但是可以设置limit值，小于limit的话该文件通过base64的格式进行内联
- eslint-loader: 多数用于pre-loader（`enforce: 'pre'`），做为语法和代码格式的预检查。

---

## output的path和publicPath

- path

> 用于配置最后文件的输出目录

- publicPath

> 开发模式下：用于配置打包后的JS和CSS和file在内存中的输出路径。 需要配合`webpack-dev-middleware`服务器做热部署服务，或直接使用`webpack-dev-server`。而且`webpack-dev-middleware`或者`webpack-dev-server`也有一个`publicPath`配置，这个配置是配置输出目录的。因为通过热部署服务器生成的资源是放在内存里的，然后我们可以通过配置这个`publicPath`作为访问这些资源的根路由。这个路径仅仅只是为了提供浏览器访问打包资源的功能。而`webpack`其他的loader和插件使用的`publicPath`仍然是`output`里面配置好的`publicPath`。所以官方推荐两处的`publicPath`配置的保持一致

> 线上模式：用于修改路径，最终修改而成的路径为`publicPath`+自己配置的`filename`

另外：`webpack`的一个生成`html`的插件`HtmlWebpackPlugin`生成`html`的同时会自动插入生成的资源（JS，CSS），他们的补全路径默认是`output.publicPath`，所以官方推荐两处的`publicPath`配置的保持一致

最后打包出来的JS，CSS，图片和字体等文件都是通过`output.path`和它自身的`filename`决定的，`output.publicPath`并不会影响打包构建的文件目录

---

## webpack HMR

再次总结一下`webpack`的HMR启用方式

首先说一下`inline`和`hot`：`inline`本身就是用于整页刷新的，就是文件更新之后整个页面刷新。而`hot`参数是尝试性地进行HMR，就是很爽爽爽爽爽爽爽的无刷新页面更新，如果在`module`里面冒泡的热更新信号没有被处理，一直冒泡到入口文件也没有被处理的话，就会HMR失败。失败了之后，就整页刷新。所以我觉得`hot`其实已经包含了`inline`了，不过怎么用还是见仁见智。

还有一个参数是`--hotOnly`，这个参数只进行HMR，失败了也不会刷新。反正失败了就是不理你。我用了一下感觉有点...hehe


经过多次试验后来发现：

- 最简单的方式就是`webpack-dev-server --inline --hot`加上`--hot`这个参数自动帮你在插件里加入`HotModuleReplacementPlugin`，十分轻松愉快。
- (以前版本可行的做法)不写参数，直接在你的`config`文件里面的`plugins`数组加入棒棒的`HotModuleReplacementPlugin`，直接启用`hot`模式，不使用参数，直接改写入口文件，比如：然后直接`webapck-dev-server`

```
entry: [
    // 'webpack-dev-server/client?http://127.0.0.1:8080',  // 加入inline配置
    // 'webpack/hot/only-dev-server',                      // 加入hot配置
    './index.js'
  ],

// 插件写上
plugins: [
    new webpack.HotModuleReplacementPlugin()
],
devServer: {
    hot: true
}
```

个人认为第二种方式有点...太过麻烦，而且`webpack-dev-server`现在的版本默认会有`GET "http://localhost:8888/sockjs-node/info?t=1506348178939".`也就是默认开启了`inline`模式。这样加入的话只会开启两个inline模式，也就是每次刷新文件都会有两次xhr请求，这样不好。

而且最麻烦的是不知道为什么这样做无法启用HMR。（`webpack-dev-server`如入无人之境不过可能是我的问题）

---

## 使用webpack-dev-middleware和webpack-hot-middleware自己搭建热部署服务器

如果说`webpack-dev-server`是别人封好的轮子，哇好麻烦好多坑，都不知道什么鬼操作。那我们可以自己凑一个热部署服务器。虽然没`webpack-dev-server`这么厉害

之前我还在纠结这个`HotModuleReplacementPlugin`有什么用，感觉完全没用，因为用于`webpack-dev-server`的时候无法开启热部署。但是如果我们想使用这两个中间件来自己搭建热部署服务器的时候，我们同样需要使用这个插件进行配置

```
entry: ['webpack-hot-middleware/client', './index.js'],

// ...

plugins: [
    new webpack.HotModuleReplacementPlugin()
]
```

然后就是配合`express`使用

- `webpack-dev-middleware`：进行打包后文件的托管返回
- `webpack-hot-middleware`：配合上面的设置，开启HMR，尝试无刷新更新页面

```
var compiler = webpack(config)

var app = express()

var hot = hotMiddleware(compiler)

app.use(devMiddleware(compiler, {
    publicPath: '/'
}))

app.use(hot)
```

至于`koa2`如何使用，可以参考[这里](https://www.npmjs.com/package/koa-webpack-middleware)，做法和`express`差不多

---

## 环境变量

我之前会使用`cross-env`来做生产环境和线上环境的区分处理。

另外`webpack`也提供了，env参数进行设置

```
webpack --env.NODE_ENV=dev
```

可以通过这样的操作启动`webpack`设置环境变量，不过还需要改写配置文件

```
// webpack.config.js

module.exports = env => {
    // 需要把配置文件导出方式从对象改成函数，环境变量将作为参数传入
    console.log(env.NODE_ENV)
}
```

---

## 模块中的全局变量

部分的第三方库可能会期望不用使用`import`或者`require`进来，直接使用，显得很方便。但是`webpack`是什么，`webpack`可是模块化打包工具啊，它当然不建议大家直接`<script />`引入进来作为全局变量。所以我们可以像上面那样使用`ProvidePlugin`把一些第三方库自动加入模块依赖。

可以使用`export-loader`，然后为这个`loader`加载的那个模块加入`module.exports`

也使用`import-loader`，然后为这个`loader`加载的那个模块进行一些全局变量的定义

```
module: {
  rules: [{
      test: require.resolve('index.js'),
      use: 'imports-loader?this=>window'
    }, {
      test: require.resolve('globals.js'),
      use: 'exports-loader?file,parse=helpers.parse'
    }]
},
```

---

## webpack runtime

> 很多人不理解runtime是什么，用官方文档的话说：在浏览器运行时，webpack 用来连接模块化的应用程序的所有代码，就是runtime。runtime 包含：在模块交互时，连接模块所需的加载和解析逻辑。

当我们每次webpack打包的时候，我们或许打包出来的文件只有一个，对，但是这一个`bundle.js`包含了你`/src`目录下所有文件，各种各样的依赖的处理。而runtime就是为了处理这些模块之间的依赖而存在的。

总结一下：
- runtime：在模块交互时，连接模块所需的加载和解析逻辑。如 `webpackJsonp`, `__webpack_require__` 等以及依赖的一系列模块。
- manifest：保留所有模块的详细要点的一个数据合集，runtime通过这个数据合集来进行模块加载。

所以我们每一次的打包这个runtime和manifest的数据合集都会产生变化，所以我们在使用`CommonsChunkPlugin`进行代码分离的时候，通常都会多加一步，把存在于`vendor.js`里面的runtime的代码单独打包出来作为一份`manifest.js`来直接引入，这样我们的`vendor.js`这个依赖库的js文件便不需要重新加载。

---

## Webpack chunk

webpack的三种chunk：

- entry chunk 入口块
- normal chunk 普通块
- initial chunk 初始块



entry chunk：就是包含`runtime`运行时的块。

normal chunk：就是使用jsonp包装加载的模块，通常来说就是通过`require.ensure`或者`import`异步加载进来的chunk

initial chunk：包含入口模块（module 0，其实就是入口文件打包出来的模块）的代码块。就是没有`runtime`的块，当entry chunk失去了`runtime`时，就变成 了initial chunk了

---

## Webpack 打包流程

1. optimist 分析命令行传入的参数并以键值对的形式把参数对象保存在 `optimist.argv` 中。
2. 将`optimist.argv`传入`./node_modules/webpack/bin/convert-argv.js`中，通过判断参数修改对应配置项。

```js
// 比如
ifBooleanArg("hot", function() {
    ensureArray(options, "plugins");
    var HotModuleReplacementPlugin = require("../lib/HotModuleReplacementPlugin");
    options.plugins.push(new HotModuleReplacementPlugin());
});
```

3. 合并好之后返回配置项`option`，通过`var compiler = webpack(option)`获得`compiler`对象，调用`compiler.run(cb)`方法启动Webpack打包。以下为Webpack打包的事件节点（生命周期），可用于编写插件。

   - compile：开始编译
   - make：分析模块以及模块间的依赖，创建模块对象
   - build-module：构建模块
   - after-compile：完成构建
   - seal：封装构建结果
   - emit：把各个chunk输出到结果文件
   - after-emit：完成输出

4. `compiler.run`调用之后会创建`Compilation`对象，这个对象是每一次执行打包都会重新创建的对象，它主要负责：

   - 组织整个打包过程，包含了每个构建环节及输出环节所对应的方法（通过这个对象上的方法进行构建和输出）
   - 存放了所有的module，chunk，生成的asset以及用来生成最后打包文件的template信息

5. 创建`module`之前，compiler会触发`make`事件，调用`Compilation.addEntry`方法。通过`option.entry`去寻找入口文件。

6. 通过入口文件一步一步创建后续模块。构建模块分为三步

   - 通过loader处理对应模块，生成一个JS Module
   - 调用 [acorn](https://github.com/ternjs/acorn) 解析经 loader 处理后的源文件生成抽象语法树 AST
   - 遍历AST，将`require`引入的模块保存到一个数组里，遍历完成后递归构建后续模块

7. 所有模块都构建完成后，Webpack触发`seal`事件，逐次对每个 module 和 chunk 进行整理，生成编译后的源码，合并，拆分，生成 hash

8. 封装过程中会生成最终 assets

   - 首屏就需要加载的JS和需要异步加载的JS会选择不同的模板对象进行封装

   ```js
   if(chunk.entry) {
     source = this.mainTemplate.render(this.hash, chunk, this.moduleTemplate, this.dependencyTemplates);
   } else {
     source = this.chunkTemplate.render(chunk, this.moduleTemplate, this.dependencyTemplates);
   }
   ```

   - 各模块进行 doBlock 后，把 module 的最终代码循环添加到 source 中。一个 source 对应着一个 asset 对象，asset对象保存了单个文件的文件名( name )和最终代码( value )。

9. 调用 Compiler 中的 `emitAssets()` ，按照 output 中的配置项将文件输出到了对应的 path 中