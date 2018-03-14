# indexDB的简单理解

---

## 创建一个indexDB并创建Object Store

在页面上使用indexDB的基本方法（封装其接口）

```javascript
	var data=[{ 
        id:1,
        name:"kimz", 
        age:18
    },{ 
        id:2,
        name:"k", 
        age:20
    },{ 
        id:3,
        name:"b", 
        age:1
    }]
    request = indexedDB.open('test',1)
	request.onerror = function(){
	    console.log('error')
	}
	request.onsuccess = function(e){
	    db = e.target.result
	    console.log('创建或打开数据库成功')
	}

	// 通过 onupgradeneeded 回调进行Object Store的创建
	request.onupgradeneeded=function(e){
	    db = e.target.result
	    if(!db.objectStoreNames.contains("students")){
	        var store = db.createObjectStore("students",{keyPath: 'id'})	// 如果不指定keyPath(主键)则默认使用1,2,3作为查找索引
	        for(var i = 0 ; i < data.length;i++){
	            request = store.add(data[i])
	            request.onerror = function(){
	             console.error('数据库中已有该数据')
	            }
	            request.onsuccess = function(){
	             console.log('数据已存入数据库')
	            }
	        }
	    }
	}
```

---

## 基本的增删查改

```js
// add

var store = db.transaction(storename,'readwrite').objectStore(storename)
var request
for(var i = 0 ; i < data.length;i++){
    request = store.add(data[i])
    request.onerror = function(){
        console.error('add添加数据库中已有该数据')
    }
    request.onsuccess = function(){
        console.log('add添加数据已存入数据库')
    }
}
```

```js
// put：通过重复添加更新已有数据

var store = db.transaction(storename,'readwrite').objectStore(storename)
var request
for(var i = 0 ; i < data.length;i++){
    request = store.put(data[i])
    request.onerror = function(){
        console.error('add添加数据库中已有该数据')
    }
    request.onsuccess = function(){
        console.log('add添加数据已存入数据库')
    }
}
```

```js
// delete

var store = db.transaction(storename,'readwrite').objectStore(storename);
store.delete(key)
console.log('已删除存储空间'+storename+'中'+key+'记录')
```

```js
// get

var store = db.transaction(storename,'readwrite').objectStore(storename)
var request = store.get(key)
request.onerror = function(){
    console.error('getDataByKey error')
}
request.onsuccess = function(e){
    var result = e.target.result
    console.log('查找数据成功')
    console.log(result)
}
```

---

## 关闭

```
db.close()
```

---

## 删除数据库

```
indexDB.deleteDatabase(databaseName)
```

---

## 索引

除了通过主键获取到数据之外，还可以通过索引获取，使用方式是，需要在创建`object Store`的时候就给它`craeteIndex`创建索引，如

```
request.onupgradeneeded=function(e){
    var db=e.target.result
    if(!db.objectStoreNames.contains('students')){
        var store=db.createObjectStore('students',{keyPath: 'id'})
        store.createIndex('nameIndex','name',{unique:true})
        store.createIndex('ageIndex','age',{unique:false})
    }
    console.log('DB version changed to '+version)
}
```

`craeteIndex`接受三个参数，第一个是索引名字，第二个是对应的键名，但三个是索引的属性值是否唯一。

然后我们可以在查找操作这样查找

```
function getDataByIndex(db, storeName){
    var store = db.transaction(storeName).objectStore(storeName)
    var index = store.index("nameIndex")
    index.get('kimz').onsuccess=function(e){
        var student = e.target.result
        console.log(student.id)
    }
}
```

---

## 游标

使用`openCursor`创建游标遍历一个`object Store`

通常会结合游标和索引一起使用，用索引引用对应的属性，用游标限制对应属性的条件，这样来筛选查找需要处理的数据，并且同时使用游标进行遍历。

```
function getMultipleData(db, storeName){
    var transaction=db.transaction(storeName)
    var store=transaction.objectStore(storeName)
    var request = store.index("nameIndex").openCursor(IDBKeyRange.bound('A', 'K', false, true))
    request.onsuccess=function(e){
        var cursor=e.target.result
        if(cursor){
            var student=cursor.value
            console.log(student.name)
            cursor.continue()
        }
    }
}
```
