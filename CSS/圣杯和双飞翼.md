## 老生常谈的三列布局

---

## 其实我觉得可以分为两大种

- 中间部分脱离文档流的
- 中间部分不脱离文档流的


## 中间部分不脱离文档流

### 两侧使用绝对定位

```
.left, .right {
	position: absolute;
	width: 95px;
	height: 100px;
}

.center {
	margin: 0 100px;
	height: 100px;
}
```

通过这种方式，使左右两部分脱离文档流，然后定宽，使得仍处于文档流的center部分与其重叠，再对center部分设定margin来让内容区不受遮挡

> 好处是三个部分在html里面的位置可以随意调换，可以选择让哪一部分优先加载。但是两侧毕竟是绝对定位，我们是使用`top: 0`使其重叠上去的，如果顶上加一个文档流内的元素，很容易炸，就是：中间和绝对定位的两边垂直方向上对不齐。

### 两侧浮动

我们也可以使用float在让两边与中间重叠起来。

```css
.left {
	float: left;
	width: 95px;
	height: 100px;
}

.right {
	float: right;
	width: 95px;
	height: 100px;
}

.center {
	margin: 0 100px;
	height: 100px;
}
```


> 好处是不会受到外部加元素的影响，但是这样做的话，center部分必须放到最后。就不能优先解析到center部分的内容

---

## 中间部分也脱离文档流

### 圣杯布局

简单来说就是三部分都是用`float: left`脱离文档流，把center部分放到最前面，宽度设为100%占满一行，让center部分优先被DOM解析，然后left和right部分通过负的margin值返回第一行与center重叠（因为浮动的元素，只有在位置不够的时候才会被挤到第二行，把margin设成极端的负值，就能回到上一行），然后center通过设定padding让内容不被挡住。

> 不过使用圣杯布局最好需要设定最小宽度。因为当center块比left块宽度小时，left块会自动换行到第二行。因为那种宽度下已经无法在同一行装下left块了，所以自动换行。


```css
/* 一个bd包着center，left，right三个子元素，利用padding来避免中间内容被挡 */
.center {
   float: left;
   width: 100%;
   background:#39c;
   height:300px;
}
.left {
   float: left;
   width: 190px;
   margin-left: -100%;
   background:#f60;
   height:300px;
   position:relative;
   left:-190px;
}
.right {
     float: left;
     width: 230px;
     margin-left: -230px;
     background:#666;
     height:300px;
     position:relative;
     right:-230px;
}
#bd {
  padding: 0 230px 0 190px;
}
```

### 双飞翼

其实双飞翼和圣杯布局差不多，只不过中间的部分的话，会使用到margin来将内容限制在中间区域。就是将在容器里面设置padding换成容器里的中间部分设置margin。

这样做的目的是：因为没有外面父容器设置到的padding，所以这一行宽度大上了许多，所以就改善了圣杯布局那种缩两缩就整个布局崩了的现象。

```css
/* center-container只包含着center，通过设置center的margin使中间不被遮住 */
.center-container {
    width: 100%;
    height: 200px;
    float: left;
}

.center {
    height: 100%;
    margin-left: 200px;
    margin-right: 200px;
    background: #39c;
}

.left {
    width: 200px;
    height: 200px;
    float: left;
    margin-left: -100%;
    background: #f60;
}

.right {
    width: 200px;
    height: 200px;
    float: left;
    margin-left: -200px;
    background: #666;
}
```

---

## 其实flex布局可以让我们省去很多很多功夫

[flex布局](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)的确简单方便又开心。但是我觉得了解这些布局，对于CSS的基础来说会有提升，毕竟很多时候，学习的目的并不是为了试着试着试出一个结果，学习的过程踩过的坑也是很帅的。
