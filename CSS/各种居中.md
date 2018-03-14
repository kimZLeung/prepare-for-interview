# CSS弄一个居中总结吧

---

## 总结一下不然又只记得那几种了

## 水平居中

### 定宽的

- 这个真的很简单，定宽嘛，直接`margin: 0 auto;`就行了
- 或者不想用`margin`，可以使用`transform`或者负`margin`（注意兼容）

```css
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);

/* or */

position: absolute;
top: 50%;
left: 50%;
margin-top: -25px;		/* 父元素高度的一半 */
margin-left: -50px;		/* 父元素宽度的一半 */
```

### 不定宽的

- 将内部元素设置成`inline-block`，然后设置父元素的`text-align: center;`
- 或者可以使用`flex`

```css
/* flex */

.container{
    width: 250px;
    height: 200px;
    background: pink;
    display: flex;
    justify-content: center;
    padding: 20px;
}

.inner{
    background: #fff;
}
```



---

## 垂直居中

- 如果定高元素则可以使用`absolute`或者负`margin`和`transform`，做法如上水平居中
- 单行行内元素只需要将内联元素的`line-height`设置为等于高度即可利用`line-height`的一个垂直居中性直接实现垂直居中
- 或者使用内联元素的`vertical-align: middle`

```css
.container {
	background: pink;
	padding: 0px;
}

.container img{
	display: inline-block;
	vertical-align: middle;
}
```

- 还可以采用`flex`布局

```css
.container{
    width: 250px;
    height: 200px;
    background: pink;
    display: flex;
    align-item: center;
    padding: 20px;
}

.inner{
    background: #fff;
}
```

---

## 水平垂直同时居中

- 前面提到的`absolute`和负`margin`和`transform`都可以实现。不过都需要定宽高

```css
/* absolute例子 */
.container {
	position: relative; 
	min-height: 500px;
	background: hsl(200, 100%, 97%);
}

.inner {
	width: 200px;
	height: 100px;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	margin: auto;
}
```

- `flex`布局的两个关键属性设置之后可以直接将子元素水平垂直居中

```css
.container{
    width: 250px;
    height: 200px;
    background: pink;
    display: flex;
    justify-content: center;
    align-item: center;
    padding: 20px;
}

.inner{
    background: #fff;
}


/* or 另一种不用设置属性的方法，不过需要定宽高 */

.container{
    width: 250px;
    height: 200px;
    background: pink;
    display: flex;
    padding: 20px;
}

.inner{
    background: #fff;
    width: 100px;
    height: 60px;
    margin: auto;
}
```
