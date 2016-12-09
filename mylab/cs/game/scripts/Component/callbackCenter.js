var register = function(name, callback, once) {
	this.unregister(name, callback);
	if (this.events[name] == null) {
		this.events[name] = [];
	}
	this.events[name].push({
		callback: callback,
		once: !!once
	});
};

var on = function(name, callback) {
	this.register(name, callback, false);
};

var once = function(name, callback) {
	this.register(name, callback, true);
};

var trigger = function(name, params) {
	if (this.events[name] != null) {
		for (var i = 0; i < this.events[name].length; i++) {
			var func = this.events[name][i].callback;
			var res = func.call(null, params);
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

var unregister = function(name, callback) {
	if (this.events[name] == null) return;
	for (var i = 0; i < this.events[name].length; i++) {
		if (callback === this.events[name][i].callback) {
			this.events[name].splice(i, 1);
			break;
		}
	}
};

var CallbackCenter = function() {
	this.events = {};
	this.register = register;
	this.on = on;
	this.once = once;
	this.trigger = trigger;
	this.unregister = unregister;
};

exports = CallbackCenter;