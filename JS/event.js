var kimz = kimz || {}

kimz._event = {
	addEvent: function (ele, type, handler) {
		if (ele.addEventListener) {
			ele.addEventListener(type, handler, false)
		} else if (ele.attachEvent) {
			ele.attachEvent('on' + type, function () {
				handler.call(ele)
			})
		} else {
			ele['on' + type] = handler
		}
	},
	removeEvent: function (ele, type, handler) {
		if (ele.removeEventListener) {
			ele.removeEventListener(type, handler, false)
		} else if (ele.detachEvent) {
			ele.detachEvent('on' + type, handler)
		} else {
			ele['on' + type] = null
		}
	},
	stopPropagation: function (e) {
		if (e.stopPropagation) {
			e.stopPropagation()
		} else {
			e.cancelBubble = true
		}
	},
	preventDefault: function (e) {
		if (e.preventDefault) {
			e.preventDefault()
		} else {
			e.returnValue = false
		}
	},
	getTarget: function (e) {
		return e.target || e.srcElement
	},
	getEvent: function (ev) {
		var e = ev || window.event
		if (!e) {
			// 获取调用这个函数的函数，就是添加事件的函数
			var c = this.getEvent.caller
			while (c) {
				e = c.arguments[0]
				if (e && Event == e.consturctor) {
					break
				}
				c = c.caller
			}
		}
		return e
	}
}

kimz._getColor = function () {
	return (~~(Math.random()*(1<<24))).toString(16)
}