var addEventListener = function(name, callback, thisObject, once) {
	this.removeEventListener(name, callback);
	if (this.events[name] == null) {
		this.events[name] = [];
	}
	this.events[name].push({
		callback: callback,
		once: !!once,
		thisObject: thisObject
	});
};

var on = function(name, callback, thisObject) {
	this.addEventListener(name, callback, thisObject, false);
};

var once = function(name, callback, thisObject) {
	this.addEventListener(name, callback, thisObject, true);
};

var dispatch = function(name, params) {
	if (this.events[name] != null) {
		for (var i = 0; i < this.events[name].length; i++) {
			var func = this.events[name][i].callback;
			var res = func.call(this.events[name][i].thisObject, params);
			if (this.events[name][i].once) {
				this.events[name].splice(i, 1);
				i--;
			}
			if (res) {
				break;
			}
		}
	}
};

var removeEventListener = function(name, callback) {
	if (this.events[name] == null) return;
	for (var i = 0; i < this.events[name].length; i++) {
		if (callback === this.events[name][i].callback) {
			this.events[name].splice(i, 1);
			break;
		}
	}
};

var EventDispatcher = function() {
	this.events = {};
	this.addEventListener = addEventListener;
	this.on = on;
	this.once = once;
	this.dispatch = dispatch;
	this.removeEventListener = removeEventListener;
};

exports = EventDispatcher;