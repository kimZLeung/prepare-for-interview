## Vue双向绑定的实现

### 具体组成

Vue对数据绑定的实现基于`Object.defineProperty`来实现，具体有三个类合作：

- observer：处理`data`opt里面的数据，对数据的`getter`和`setter`进行一层代理，用于数据绑定的实现
- watcher：在渲染视图的`parser`里创建，对应一个需要有数据绑定的DOM节点，如一些`v-model`的表单。创建后可立即通过调用自身的`get`方法，通过获取一次这个`data`里面的值，调用到被代理的`getter`进行一波依赖收集，将这个`watcher`push进去这个值的`dep`实例里面。
- dep：总的来说是一个事件的发布者，一个`dep`实例对应一个值，被代理的`setter`方法会调用到这个`dep`实例的`notify`方法来通知该`dep`上的所有`watcher`进行数据更新



### 理一遍流程

> `new Vue(opt)` 之后，我们把相应的配置项通过`opt`传入，对于`opt.data`，首先会使用`observer`对其进行处理，对于`data`里面的每一个键都进行`getter`和`setter`的代理，每一个代理都创建一个`dep`的实例，来发布这个值是否有修改，而DOM视图渲染时，通过匹配到DOM字符串上的`v-`指令，通过创建`watcher`并且调用`watcher.get`方法，触发之前处理好的`getter`代理，从而把该依赖加入到对应值的`dep`中。
>
> 当数据更新，会由对应的数据的`dep`实例触发对应的`watcher`进行页面更新。

