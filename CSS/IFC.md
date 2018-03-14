# IFC（Inline formatting context）

---

## 简述

相对于块格式化上下文，在行内格式化上下文中，框( boxes )一个接一个地水平排列，起点是包含块的顶部。 水平方向上的 margin，border 和 padding 在框之间得到保留。 （垂直方向上的margin和padding也有，但是并不会撑开距离）框在垂直方向上可以以不同的方式对齐：它们的顶部或底部对齐，或根据其中文字的基线对齐。 包含那些框的长方形区域，会形成一行，叫做行框。

---

## line box

行框表示IFC内行内元素排列的一行的一个框，所以可以说一个 line box 包含有复数个 inline-level box

我们都知道inline-level box 在垂直方向上的高度不是通过`height`属性来决定的，是通过文字`font-size`来撑开决定的，而 line box 的高度最终是由`line-height`决定的。（也就是说`line-height`并不会影响到这个 inline-level box 的高度）


并且如果行内元素旁边存在浮动元素（float）的话，这一行的line box会避开浮动元素，也就是宽度会被压缩

---

## summary

其实我在网上找了很多资料，也不清楚IFC和BFC的具体区别，只知道BFC的创建方法和一些特性，对于IFC的定义十分模糊。感觉上有行内元素存在就会形成IFC的布局。

而且查到的关于IFC的资料上都是大篇幅讲 line box 的高度和宽度。行内元素的高度怎么决定。行内元素垂直方向的对齐问题（各inline-level box根据vertical-align属性值相对各自的父容器作垂直方向对齐）。行内元素换行分成几个 line box 这些点的理论，感觉跟BFC并不是一个完全并列的概念

---

（补充行内元素布局）

## line-height

`line-height`这个属性之前没有过多去关注。其实它作用在块级元素和内联元素上是不同的。

作用在块级元素上：块级元素靠设置`height`顶开高度，但是如果没有设置`height`，我们依然可以把它顶开，如果一个标签没有定义height属性(包括百分比高度)，那么其最终表现的高度一定是由line-height起作用。所以我们其实也可以直接给这个块级元素设置它的`line-height`，通过`line-height`让下面的文字（inline-level box）撑开块级元素。块级元素包含内联元素时，内联元素形成的 line box 可以撑开块级元素的高度。但是如果设定了这个块级元素的height，那么这个块级元素的高度将会由height决定，然后下面再有元素的话也不会被line box撑开

作用在内联元素上：内联元素在我们设置`line-height`的时候无法帮我们撑开内容区高度，但是我们这一行的 line box 就是又我们的`line-height`为基础计算出高度的，而且line box可以为inline-level box撑开空间（并不是指content区），而 line box 也决定了我们很麻烦的一个属性，vertical-align（垂直对齐）的效果。内联元素的内容区也不会通过 line box 撑开，而是通过内部填充的字体撑开的。但是这个内联元素的实际占位（高度）就是line-height决定的。而往往显示的是内容区。但是这一行的line box 是由`line-height`决定的。

---

## baseline

普通内联元素的[baseline](http://www.jianshu.com/p/c92849a97ef5)

然而`inline-block`元素会有特殊的baseline

> 一个inline-block元素，如果里面没有inline内联元素，或者overflow不是visible，则该元素的基线就是其margin底边缘，否则，其基线就是元素里面最后一行内联元素（最后一行line box）的基线。

---

## line-height与line box有很大的关系

vertical-algn的属性表

| 值 | 描述 |
|-----|-----|
| 长度 | 通过距离升高（正值）或降低（负值）元素。'0cm'等同于'baseline' |
| 百分值 – % | 通过距离（相对于1line-height1值的百分大小）升高（正值）或降低（负值）元素。'0%'等同于'baseline' |
| baseline | 默认。元素的基线与父元素的基线对齐。 |
| sub | 降低元素的基线到父元素合适的下标位置。 |
| super | 	升高元素的基线到父元素合适的上标位置。 |
| top | 把对齐的子元素的顶端与line box顶端对齐。 |
| text-top | 把元素的顶端与父元素内容区域的顶端对齐。 |
| middle | 元素的中垂点与 父元素的基线加1/2父元素中字母x的高度 对齐。 |
| bottom | 把对齐的子元素的底端与line box底端对齐。 |
| text-bottom | 把元素的底端与父元素内容区域的底端对齐。 |
| inherit | 采用父元素相关属性的相同的指定值。 |

可以看到vertical-align的对齐规则和line box，baseline有很大关系

---

## summary twice

现在我对水平布局的理解：其实行内元素的水平布局过来，一般来说是从左到右通过vertical-align根据baseline对各个内联元素进行垂直方向的定位，各个定位好的元素也会根据自己的line-height把 line box 顶开，从而改变 line box 的高度。

至于 line box 高度的变化我认为并不会影响到line box的baseline，我所理解的line box 的baseline就是那一行的字体的baseline
