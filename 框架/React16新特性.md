## React16 新特性

### 新增componentDidCatch

之前，一旦某个组件发生错误，整个组件树将会从根节点被unmount下来

新增一个生命周期函数`componentDidCatch`，用于捕获自身及子树上的错误并对错误做优雅处理，附上比较好的做法

```js
import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor (props) {
        super(props)
        this.state = { error: false }
    }
    componentDidCatch (err, info) {
        this.setState({ 
            error: true,
            reason: info
        })
    }
    render () {
        const { reason } = this.state
        if (this.state.hasError) {
            return <div>err!{ reason }</div>
        }
        return this.props.children
    }
}
```

暴露这个公共组件，用他包着那些比较容易会抛出错误的组件



### Render方法返回类型

render方法支持直接返回string，number，boolean，null，portal，以及fragments(带有key属性的数组)



### createPortal

这个方法可以将你的React组件渲染在你想渲染的任意DOM位置，但是在React中，这个组件仍然处在React的父组件之内，这个组件触发的事件仍然能通过冒泡被他的父组件catch到。

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Overlay extends Component {
    constructor(props) {
        super(props);
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
    }
    componentWillUnmount() {
        document.body.removeChild(this.container);
    }
    render() {
        return ReactDOM.createPortal(
            <div className='overlay'>
                <span className='overlay-close' onClick={this.props.onClose}>&times;</span>
                {this.props.children}
            </div>,
            this.container
        )
    }
}
```



### setState传入null时不触发更新

比如一些下拉框，有可能选择了原来的值，所以实际上并不需要更新，这个时候可以利用`setState`传入参数，判断值是否有更改来return对应的值（这样就不需要使用`shouldComponentUpdate`了）



### 更好的服务端渲染

听说性能好了很多，没用过，而且提供了一种流模式，可以更快地让客户端渲染出html。（Vue好像一直都有流模式的客户端渲染）