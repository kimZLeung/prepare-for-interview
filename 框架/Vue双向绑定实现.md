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



### 总结

> 每当 new 一个 Vue，主要做了两件事：第一个是监听数据：observe(data)，第二个是编译 HTML：nodeToFragement(id)。
>
> nodeToFragement这个过程是将挂载目标子节点内容（#el）抽出来，对其一个一个进行模板处理，将你的数据填到模板中，再一个一个返回出来append到文档碎片中，最后再一起挂载到目标节点
>
> 在监听数据的过程中，会为 data 中的每一个属性生成一个主题对象 dep。
>
> 在编译 HTML 的过程中，会为每个与数据绑定相关的节点生成一个订阅者 watcher，watcher 会将自己添加到相应属性的 dep 中。
>
> 通过getter属性，每次getter判断是否存在`Dep.target`，而编译时会为每个与 data 关联的节点生成一个 Watcher，在Watcher的构造中，会把自己赋给`Dep.target`，再get这个属性值，这样这个Watcher就加入了该属性的dep中了（当然也会加入到它的父属性的dep中，所以父属性修改也会触发这个更新）