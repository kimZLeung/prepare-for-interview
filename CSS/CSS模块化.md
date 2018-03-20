### CSS模块化方案

CSS 模块化的解决方案有很多，但主要有两类。

- 一类是彻底抛弃 CSS，使用 JS 或 JSON 来写样式。[Radium](https://github.com/FormidableLabs/radium)，[jsxstyle](https://github.com/petehunt/jsxstyle)，[react-style](https://github.com/js-next/react-style) 属于这一类。
  - 优点是能给 CSS 提供 JS 同样强大的模块化能力；
  - 缺点是不能利用成熟的 CSS 预处理器（或后处理器） Sass/Less/PostCSS。
- 一类是依旧使用 CSS，但使用 JS 来管理样式依赖，代表是Webpack的 [CSS Modules](https://github.com/css-modules/css-modules)。



> CSS 模块化重要的是要解决好两个问题：CSS 样式的导入和导出。
>
> 灵活按需导入以便复用代码；
>
> 导出时要能够隐藏内部作用域，以免造成全局污染。



结合 Webpack 的 `css-loader`使用

```js
// webpack.config.js
css-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]
```

加上 `modules` 即为启用，`localIdentName` 是设置生成样式的命名规则。

通过按照一定的算法生成的CSS类名几乎是唯一的，大大降低项目中样式覆盖的几率

而且通过使用对象来保存原 class 和混淆后 class 的对应关系

```js
Object {
  normal: 'button--xxxxxxxxx',
  disabled: 'button--xxxxxxxxx',
}
```

并且在想使用全局样式时，可以使用`global()`进行修饰。全局规则都不会被编译成哈希字符串



### CSS Modules 使用技巧

- 不使用选择器，只使用 class 名来定义样式
- 不层叠多个 class，只使用一个 class 把所有样式定义好
- 所有样式通过 `composes` 组合来实现复用
- 不嵌套



### 外部如何覆盖局部样式

> 可以加上特殊属性，通过属性选择器去覆盖，因为 CSS Modules 只会转变类选择器