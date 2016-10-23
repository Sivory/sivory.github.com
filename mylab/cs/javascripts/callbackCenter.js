(function() {
	var register = function(name, callback) {
		this.unregister(name, callback);
		if (this.events[name] == null) {
			this.events[name] = [];
		}
		this.events[name].push(callback);
	}

	var trigger = function(name, params) {
		if (this.events[name] != null) {
			for (var i = 0; i < this.events[name].length; i++) {
				var func = this.events[name][i];
				func.call(null, params);
			}
		}
	}

	var unregister = function(name, callback) {
		if (this.events[name] == null) return;
		for (var i = 0; i < this.events[name].length; i++) {
			if (callback == this.events[name][i]) {
				this.events[name].splice(i, 1)
				break;
			}
		}
	}

	window.CallbackCenter = function() {
		this.events = {};
		this.register = register;
		this.trigger = trigger;
		this.unregister = unregister;
	}
})();