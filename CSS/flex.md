### flex布局

> 如何理解flex布局？

**误区 ：**对`flex-item`设置`flex: 1` ，另一个`flex-item`设置`flex: 2` ，后者将是前者宽度的两倍。好的这是错误的。

**更正：** 对于`flex` 布局来说，有必要先去计算每一个`flex-item`的初始内容宽度，这样才能继续后续的布局计算。



### 初始内容宽度

> 这里暂时没有考虑极端情况，比如`flex-item` 撑爆容器

在[别人的博客](https://www.w3cplus.com/css3/flexbox-layout-and-calculation.html)看到了以下的初始内容宽度的计算情况：

- flex-basis 的优先级比 width[height]: 非auto; 高，
- 元素存在默认宽高，看默认宽高和flex-basis谁比较宽
- 元素存在 min-width[height] 或者 max-width[height]，看min-width和flex-basis谁比较宽
- width[height]: auto; 优先级等于 flex-basis。



总结一下：

- 当只有默认宽度（没有设置width，flex-basis，min-width）时，初始内容宽度为默认宽度
- 当有默认宽度和flex-basis时（没有设置width，min-width），看哪个长用哪个
- 当声明了width，覆盖掉默认宽度并且声明了flex-basis（没有min-width），那就和flex-basis比谁长用谁
- 当声明了min-width，覆盖掉默认宽度并声明flex-basis，那就和flex-basis比谁长用谁

> width和min-width都会覆盖掉默认宽度，默认宽度没有被覆盖时，会和flex-basis比较，但是被覆盖之后，就要看覆盖它的那个宽度和flex-basis谁大谁小





### flex grow

当清楚了初始内容宽度之后。`flex-grow`的布局规则就是：初始内容宽度排过去，把容器剩余空间抽出来，按照`flex-grow` 进行按比例划分，分给各个`flex-item`

![grow1](./img/flexbox11.png)

​										执行grow前

![grow2](./img/flexbox12.png)

​										执行grow后



### flex shrink

当初始内容宽度超出的时候（`flex-warp: nowarp`），会通过flex-shrink进行压缩，具体的步骤是把超出的空间抽出来，按照flex-shrink的值进行按比例划分，分好后再用对应的`flex-item`减去对应的值

![shrink1](./img/flexbox15.png)

​										执行shrink前

![shrink2](./img/flexbox16.png)

​										执行shrink后



### 总结

理解flex布局，主要是要理解`flex-item` 的初始内容宽度。flex布局的效果都是基于这个宽度完成的