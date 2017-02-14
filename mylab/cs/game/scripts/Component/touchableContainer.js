// 可触摸元素容器，会将触摸事件向下传递

var Container = imports('container');

var ontouchstart = function(e) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].ontouchstart != null) {
			var res = this.children[i].ontouchstart.call(this.children[i], e);
			if (res) break;
		}
	}
};

var ontouchmove = function(e) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].ontouchmove != null) {
			var res = this.children[i].ontouchmove.call(this.children[i], e);
			if (res) break;
		}
	}
};

var ontouchend = function(e) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].ontouchend != null) {
			var res = this.children[i].ontouchend.call(this.children[i], e);
			if (res) break;
		}
	}
};

var TouchableContainer = function() {
	Container.call(this);
	this.ontouchstart = ontouchstart;
	this.ontouchmove = ontouchmove;
	this.ontouchend = ontouchend;
};

exports = TouchableContainer;