# 看了一下Gulp

---

## Gulp的四大方法
- `gulp.src(globs[,options])`
- `gulp.dest(path[,options])`
- `gulp.task(name[,deps],fn)`
- `gulp.watch(golb,[,opts,cb])` 或者 `gulp.watch(glob[,opts],tasks)`

---
## 解释
- `src`方法会返回一个对应匹配的文件流`stream`然后可以被`piped`到别的插件中执行
- `dest`方法会写文件，可用于创建，并且重新输出所有数据，会返回`stream`，后面可以继续接`piped`
- `task`方法是gulp比较常用的任务方法，可用于创建任务。因为Gulp运行时任务是并行执行的，想要一个任务依赖另一个并且按顺序执行的话，必须两边配合，一头被依赖方需要返回一个`steam`或者`promise`或者往回调函数里传一个`callback`，结束的时候调用`callback`这样。另一方面，依赖方需要在(依赖列表)也就是那个数组里面放入依赖的任务。
- `watch`方法是监听的意思，可以Gulp运行可以监听一些文件的变动，最后一个参数是一个数组，装着文件变动后需要执行的`task`
- `watch`还可以直接传回调函数指定每次变化执行的回调
- 虽然`Gulp`只有四个方法，但是这四个方法组合起一系列的`Gulp`插件可以将源文件进行一系列处理并且打包输出处理好的文件



