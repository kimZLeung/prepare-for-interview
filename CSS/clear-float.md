### 清除浮动的几种方法

#### 插入DOM元素

```html
<div style="clear: both"></div>
```



#### 使用CSS伪元素

```css
.clearfix::after {
    content: '';
    visibility: hidden;
    display: block;
    height: 0;
    clear: both;
}

.clearfix {
    zoom: 1; 	/* 兼容IE6/7 */
}
```



#### 使用BFC

> 因为因为 [BFC](https://github.com/byronlun/prepare-for-FE-interview/blob/master/css/BFC(Block%20Formatting%20Context).md) 是可以包含浮动元素的，所以可以把父级元素设置成BFC以此清除浮动

```css
.container {
    overflow: hidden;
}
```



#### 使用contain-float

> 实验属性最好不要用

```css
.container {
    min-height: contain-float;
}
```

