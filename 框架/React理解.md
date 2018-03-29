### 调用 setState 之后发生了什么？

> 在代码中调用setState函数之后，React 会将传入的参数对象与组件当前的状态合并，然后触发render更新组件，通过构造出新的虚拟DOM与原来的虚拟DOM作diff比较。根据差异对界面进行最小化重渲染。在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。



### React 中 Element 与 Component 的区别是？

> React Element 是描述屏幕上所见内容的数据结构，是对于 UI 的对象表述。典型的 React Element 就是利用 JSX 构建的声明式代码片然后被转化为createElement的调用组合。而 React Component 则是可以接收参数输入并且返回某个 React Element 的函数或者类。



### 在什么情况下你会优先选择使用 Class Component 而不是 Functional Component？

> 在组件需要包含内部状态或者使用到生命周期函数的时候使用 Class Component ，否则使用函数式组件。



### React 中 refs 的作用是什么？

> Refs 是 React 提供给我们的安全访问 DOM 元素或者某个组件实例的句柄。我们可以为元素添加ref属性然后在回调函数中接受该元素在 DOM 树中的句柄，该值会作为回调函数的第一个参数返回



### React 中 keys 的作用是什么？

> Keys 是 React 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识。



### 在生命周期中的哪一步你应该发起 AJAX 请求？

> 我们应当将AJAX 请求放到 componentDidMount 函数中执行
>
> - React 下一代调和算法 Fiber 会通过开始或停止渲染的方式优化应用性能，其会影响到 componentWillMount 的触发次数
> - 如果我们将 AJAX 请求放置在生命周期的其他函数中，我们并不能保证请求仅在组件挂载完毕后才会要求响应。如果我们的数据请求在组件挂载之前就完成，并且调用了setState函数将数据添加到组件状态中，对于未挂载的组件则会报错



### shouldComponentUpdate 的作用是啥

> shouldComponentUpdate 允许我们手动地判断是否要进行组件更新，根据组件的应用场景设置函数的合理返回值能够帮我们避免不必要的更新。



### 为什么我们需要使用 React 提供的 Children API 而不是 JavaScript 的 map？

> 因为children有可能并不是数组。使用props.children.map函数来遍历时会受到异常提示，因为在这种情况下props.children是对象（object）而不是数组（array）。



### React的合成事件机制

> 为了解决跨浏览器兼容性问题，React 会将浏览器原生事件（Browser Native Event）封装为合成事件（SyntheticEvent）传入设置的事件处理器中。这里的合成事件提供了与原生事件相同的接口，不过它们屏蔽了底层浏览器的细节差异，保证了行为的一致性。
>
> 另外React并没有直接将事件挂载在DOM的每个小的元素上，而是在全局挂载一个事件监听，等其他事件冒泡上来的时候，才会触发执行回调，利用了事件委托进行优化



### createElement 与 cloneElement 的区别是什么？

> createElement 函数是 JSX 编译之后使用的创建 React Element 的函数，而 cloneElement 则是用于复制某个元素并传入新的 Props。



### 传入 setState 函数的第二个参数的作用是什么？

> 该函数会在setState函数调用完成并且组件开始重渲染的时候被调用



### 通常怎么通过props更新触发state更新

> 可以在`componentWillReciveProps`里面，通过对比新旧的`props`，来利用`this.setState`来更新`state`。
>
> 需要注意的是，不能再`componentWillUpdate`里面调用`this.setState()`进行更新，因为这样会触发无限更新