### JS的抽象相等 ==

#### 类型转换规则

```js
1. undefined == null，结果是true。且它俩与所有其他值比较的结果都是false。

2. String == Boolean，需要两个操作数同时转为Number。

3. String/Boolean == Number，需要String/Boolean转为Number。

4. Object == Primitive，需要Object转为Primitive(具体通过valueOf和toString方法)。
```



总的来说，基本类型基本都会用`toNumber()`转化比较，引用类型需要通过`toPrimitive()`方法转换，转换为基本类型之后再用上述规则比较。



> `toPrimitive`方法用于将对象转化为原始值，即字符串，数值，或布尔值（原始的基本类型就是null, undefined, string, number, boolean, symbol(ES6)）
>
> 规则：判断对象是否为Date对象，是的话优先调用`toString`，否则优先调用`valueOf`，要是这两个方法返回基本类型就返回这个基本类型值