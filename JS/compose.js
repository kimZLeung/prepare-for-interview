function compose() {
	var funcs = toArray(arguments)
	return function(data) {
		return funcs.reduceRight(function(lastRes, func) {
			return func(lastRes)
		}, data)
	}
}

function toArray(arr) {
	return Array.prototype.slice.call(arr)
}


// test
function add(next) {
	next = next + 1
	return next
}

function reduce(next) {
	next = next - 2
	console.log(next)
	return next
}

var haha = compose(add, reduce)

haha(10)