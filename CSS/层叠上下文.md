# 层叠上下文和层叠顺序

---

## 层叠顺序

层叠顺序是CSS在页面布局中最基本的规则，决定了页面上的图层(可以这样说)，也就是决定了什么元素覆盖在什么元素的上方。

对于浏览器渲染的页面，层叠顺序是（从低到高）：

- 层叠上下文的background / border
- 负z-index
- block块级水平盒子
- float浮动盒子
- inline / inline-block 水平盒子
- z-index: auto 或者 z-index: 0 或者 不依赖z-index的层叠上下文
- 正z-index

也就是说，若是形成层叠上下文的话，层叠上下文将会覆盖掉block盒子，float盒子甚至是inline盒子。

而且，处于同级的元素的堆叠顺序是，后面的元素铺在上面，这是浏览器堆叠元素的规则。

---

## 层叠上下文

上面也提到层叠上下文位于第6层，一旦形成层叠上下文，这个元素则会覆盖掉（遮住）block盒子，float盒子甚至是inline盒子。

形成层叠上下文的几个条件：

- 根元素天生层叠上下文
- position为`absolute/relative`的元素，或者FireFox等内核不为-webkit-的浏览器`position: fixed`的元素，z-index不为auto时，可以形成层叠上下文
- z-index不为auto的flex项（即flex布局里的item），可以形成层叠上下文
- 元素的`opacity`值小于1，可以形成层叠上下文
- 元素的`transform`值不为`none`，可以形成层叠上下文
- 元素的`mix-blend-mode`不是`normal`，可以形成层叠上下文
- 元素的`filter`值不为`none`，可以形成层叠上下文
- 元素的`isolation`值为`isolate`，可以形成层叠上下文
- `will-change`属性指定为上面任意一个
- 元素的`-webkit-overflow-scrolling`设为`touch`

以上条件来自[张鑫旭总结](http://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

若创建一个层叠上下文，则层叠上下文会提高它自身的等级，而且有着和BFC异曲同工之妙：每个层叠上下文和兄弟元素独立，也就是当进行层叠变化或渲染的时候，只需要考虑后代元素。每个层叠上下文是自成体系的，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中。

> 上面这句话就是说，一旦建立了层叠上下文，两个层叠上下文内部的元素不会有任何层叠比较，均以层叠上下文这一块谁高谁厉害

```html
<div style="position:relative; z-index:auto;">
    <img src="xxx.jpg" style="position:absolute; z-index:2;">
</div>
<div style="position:relative; z-index:auto;">
    <img src="yyy.jpg" style="position:relative; z-index:1;">
</div>
<!-- 这个是前面z-index比较高的会在上层 -->


<!-- 但是... -->
<div style="position:relative; z-index:0;">
    <img src="xxx.jpg" style="position:absolute; z-index:2;">
</div>
<div style="position:relative; z-index:0;">
    <img src="yyy.jpg" style="position:relative; z-index:1;">
</div>
<!-- 进行这样的修改之后，形成了上下两个层叠上下文，他们内部的层叠互不干扰，只看他们自身的高度 -->
<!-- 因为这两个层叠上下文同层，所以他们是后面那个处于上层 -->
```

---

## 为了理解层叠顺序最底层的一处

层叠上下文最底部的那层是层叠上下文的 background / border ，所以普通的block元素的 background / border 是会覆盖负`z-index`这一层的，比如

```
<div class="box">
    <div>
    	<img src="xxx.jpg">
    </div>
</div>

.box { 
	/* display: flex */
}
/*
 * 这里的div属于普通的block元素，会覆盖掉z-index为负值的元素
 *
 * 但是如果给父容器box一个flex布局属性。则会使这个div成为flex布局的一个item
 * 满足成为层叠上下文的条件，则这个块级元素成为了层叠上下文
 * 则背景自然会比负z-index低一层
 */
.box > div {
	background-color: blue; 
	z-index: 1; 
}
.box > div > img { 
  position: relative;
  z-index: -1; 
  right: -150px;
}
```

但是这只是为了说明要点的特殊情况，一般来说这些inline内联元素是不会被块级元素覆盖的，因为堆叠顺序这样设计就是为了方便我们进行排布页面的。

---

## 实际应用

记得之前完成招新页面的时候，我使用的是`z-index`控制轮播的层数来进行轮播的播放，并且我需要在轮播上覆盖一个渐渐变浅的罩层，让视觉效果看起来舒服一点。为了尽量不修改过多的DOM节点，我仅仅把每次轮播的图片item的z-index加1，但是久而久之，加着加着我的z-index就超过了我罩层的z-index，导致我的罩层反而被遮盖了。

这个时候就可以发挥层叠上下文的威力了，我们只要把轮播的容器`container`设置成层叠上下文，然后把罩层设成正的z-index，那么无论层叠上下文内部的`z-index`值有多大，都不会突破层叠上下文来覆盖掉我的罩层。

---

再次附上[活泼的参考连接](http://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)
