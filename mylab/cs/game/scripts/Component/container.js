var addChild = function(obj) {
	this.children.push(obj);
};

var removeChild = function(obj) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] == obj) {
			this.children.splice(i, 1);
			return;
		}
	}
};

var Container = function() {
	this.children = [];
	this.addChild = addChild;
	this.removeChild = removeChild;
};

exports = Container;