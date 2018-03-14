### link vs @import

- link可以引入CSS，包括可以做标签左侧的小图标。@import只能引入CSS
- @import比link其实更延迟一些，它会等到页面下载完后才加载
- 由于@import样式表的延后加载，可能会导致页面样式闪烁，而且不利于浏览器并行加载资源
- @import是CSS2.1提出的所以老的浏览器不支持，@import只有在IE5以上的才能识别，而link标签无此问题。
- 由于@import样式表的延后加载，很有可能会比页面中的javascript 脚本加载更晚，导致js 对html 元素样式的修改可能会被延后才解析的外部样式表所覆盖