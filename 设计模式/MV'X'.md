# MV*模式

---

## MVC
> MVC是最原始的分层方式，即`Modal - View - Controller`，这种分层方式将业务逻辑、数据和视图分离开来。降低代码维护和二次开发的成本。

用户行为通过View层传递到Controller层进行处理，Controller层封装了业务逻辑的代码，对用户的行为进行了一系列的逻辑处理，然后调用Modal层的接口更新数据，更新后的数据通过观察者模式直接从Modal层同步到View层

依赖的顺序是：Modal层作为最低级最基础的层不依赖任何层，View层直接依赖Modal层的数据进行视图渲染，Controller层依赖Modal层和View层（如果是直接在Controller层加事件绑定逻辑的话）

有另外一种MVC是在View层绑定交互事件，这个时候Controller层只依赖Modal层，View层会依赖到Modal层和Controller层

> 缺点：MVC的缺点是View层直接依赖Modal层的数据进行视图渲染，使得View层和Modal层耦合在一起，不利于复用。
> Controller测试困难。因为Controller层只改变Modal层的数据，然后View层通过Modal直接提供的数据进行视图渲染，所以单元测试需要依赖这两个层，比较困难

---
## MVP
> MVP是MVC的进化版。MVP把View层和Modal层解耦。在Presenter层接受View层的交互行为，去调用Modal层的接口，数据修改后通过观察者模式传递到Presenter层，再又Presenter层通过调用View层提供的接口更新视图。

依赖的顺序是：Modal层不依赖任何层，View层也不会依赖Modal层，View不再负责同步的逻辑。而是由Presenter负责。Presenter中既有应用程序逻辑也有同步逻辑。Presenter层依赖Modal层和View层。其实这个模式，Presenter层负责了Modal层和View层的通讯。

> 缺点：Presenter比较笨重，因为太多逻辑都塞到了Presenter中

---
## MVVM
> 因为Presenter层比较笨重，所以产生了ViewModal，ViewModal本身封装了一堆View和Modal层同步的逻辑。把同步自动化，从而让开发人员专心于维护业务逻辑代码。
