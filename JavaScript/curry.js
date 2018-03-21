const curry = fn => {
  const curried = (...args) => args.length >= fn.length ?
    fn.call(this, ...args) :
    (...rest) => curried.call(this, ...args, ...rest);
  return curried;
}

// 更加简单的curry版本，通过闭包访问原函数fn，每一次执行时判断参数长度，每一次调用时保存加入新的参数。
const _curry = (fn) => {
	const curried = (...args) => {
		if (args.length >= fn.length) {
			return fn.call(this, ...args)
		} else {
			return (...rest) => {
				return curried.call(this, ...args, ...rest)
			}
		}
	}
	return curried
}

function curry(fn, length) {
	var len = length || fn.length
	return function() {
		var innerLen = arguments.length
		if(arguments.length < len) {
			var combined = [fn].concat(toArray(arguments))
			return curry(subCurry.apply(this, combined), len - innerLen)
		} else {
			return fn.apply(this, arguments)
		}
	}
}

function subCurry(fn) {
	var args = Array.prototype.slice.call(arguments, 1)
	return function() {
		return fn.apply(this, args.concat(toArray(arguments)))
	}
}

function toArray(arr) {
	return Array.prototype.slice.call(arr)
}


// function _curry(fn) {
// 	var len = fn.length
// 	var param = []
// 	return function _subCurry() {

// 		console.log(len, param.length, arguments.length)
// 		if (arguments.length < len - param.length) {
// 			param = param.concat(Array.prototype.slice.call(arguments))
// 			return _subCurry
// 		} else {
// 			param = param.concat(Array.prototype.slice.call(arguments))
// 			fn.apply(this, param)
// 		}
// 	}
// }

// test
function add(a, b, c) {
	console.log('result', a + b + c)
}

var cAdd = curry(add)

cAdd(1)(2)(3)
cAdd(1, 2)(3)
cAdd(1)(2, 3)
cAdd(1, 2, 3)