## Flux

> Redux和Vuex其实都借鉴了Flux的思想，Flux的数据流的思想是 **单向数据流**

**整体的数据流动是这样的：**View 发起 Action -> Dispatcher 收到 Action -> Dispatcher 通知 Stores 进行相应的更新 -> Stores 状态更新之后通知 Views 进行改变。

![](E:\myGit\prepare-for-interview\框架\img\flux-diagram.jpg)

- **Views** 就是视图。负责渲染界面，捕获用户事件，从**Stores**获取数据。
- **Action** 是一种行为，不同的Action传到Dispatcher会触发生成不同的数据
- **Stores** 用来管理数据。一个 Store管理一个区域的数据，当数据变化时会通知Views。
- **Dispatcher** 接收新数据然后传递给 Stores，Stores 更新数据并通知 Views。



## Redux

> Redux也是受到了Flux的影响，Redux中，Reducer代替了Dispatcher，用于更新store。Reduer的作用是使用一个纯函数来代替Dispatcher，这个纯函数接收原 state tree 和 action 作为参数，并生成一个新的 state tree 代替原来的
>
> 而且Redux不会修改原来的state，而是每一次的action通过reducer生成新的state去代替旧的state

### 核心概念

- **Actions** 是动作行为的抽象，是向 Store 传递数据信息的一个动作行为对象（一般是用户触发的交互信息），是改变 state 的唯一方法。
- **Reducers** 其实是一个函数： `(state, action) => newState`，是根据 action 来更新 state 的计算过程。
- **Store** 是保存数据的地方，其实就是状态容器。而且整个应用只有一个 Store。
- **Middleware** 其实是高阶函数，当 Store.dispatch 发起一个 action 的时候，可以用中间件作用于 dispatch 返回一个新的 dispatch（附加了该中间件功能）。



### 中间件

一般来说，Redux的单向数据流发起修改的起点是`dispatch`一个`action`，但是`Redux`为我们提供了一套很丰富的插件系统，我们可以引用社区封装的插件，甚至可以自行写插件来对`dispatch`函数进行增强，达到我们想要的效果

```js
// applyMiddleware 源码
let chain = []

const middlewareAPI = {
    getState: store.getState,                // 调用 redux 原生方法，获取状态
    dispatch: (...args) => dispatch(...args) // 调用 redux 原生 dispatch 方法
}
// 串行 middleware
chain = middlewares.map(middleware => middleware(middlewareAPI))
// 利用中间件封装代理原来的dispatch函数
dispatch = compose(...chain)(store.dispatch)

// compose
export default function compose(...funcs) {
  // 把中间件一层一层封装起来
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

```js
// 中间件写法 redux-thunk 源码
export default ({ dispatch, getState }) => next => action => {
  // 判断传入的action是否为function，是的话执行这个function并且把dispatch传入用于异步dispatch
  if (typeof action === 'function') {
    return action(dispatch)
  }
  // 如果不是，则把action原样传入下一个中间件
  return next(action) 
}
```





## Vuex

> 同样基于Flux架构，但是和 Redux 中使用不可变数据来表示 state 不同，Vuex 中没有 reducer 来生成全新的 state 来替换旧的 state，Vuex 中的 state 是可以被修改的。

### Vuex 核心概念

- **State** 理解为保存数据变量的状态
- **Getters** 可理解为 store 的计算属性，传入 state，得到 state 的一些衍生状态（配合mapGetteers把state中的属性放入组件的computed计算属性中）
- **Mutations** 类似于 Redux 的 reducer，提交一个 mutation 就会响应改变 state，从而触发视图更新（一般是在Actions里面commit的）Mutations必须同步！！！
- **Actions** 类似于 mutation，只是 action 是间接提交一个 mutation 的方式（因为 mutation 是同步执行的，对于异步执行的就要通过 action 进行操作之后，提交一个 mutation。等于给redux加了一个redux-thunk中间件，注意dispatch一个action后返回Promise对象）
- **Modules** 主要是对太复杂的数据进行分而治之，划分模块来管理，每个模块拥有各自的 state, getter, mutation, action。（如果模块没有使用命名空间`namespaced: true`，注意各个模块的getter、mutation、action名称冲突问题）



> 类似于Redux的middleware，Vuex有提供插件机制。插件会暴露出每次 mutation 的钩子。Vuex 插件就是一个函数，它接收 store 作为唯一参数

```js
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    // state为更新后的数据
  })
}

// 用法
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```



所以还是这个问题，为什么mutations需要同步（其实它可以异步，但是代价是所有插件都会出问题），因为它作为插件的钩子，所以必须同步。