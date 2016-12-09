var createCanvas = function(zindex) {
	var canvas = document.createElement('canvas');
	$(canvas).css({
		position: 'fixed',
		left: 0,
		top: 0,
		'z-index': zindex ? zindex : 0,
		background: 'transparent'
	});
	document.body.append(canvas);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.addEventListener('resize', function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
	return canvas;
};

var getContext = function() {
	return this.ctx;
};

var getWidth = function() {
	if (this.canvas.width < this.canvas.height) {
		return this.canvas.height;
	} else {
		return this.canvas.width;
	}
};

var getHeight = function() {
	if (this.canvas.width < this.canvas.height) {
		return this.canvas.width;
	} else {
		return this.canvas.height;
	}
};

var setWidth = function(val) {
	if (this.canvas.width < this.canvas.height) {
		this.canvas.height = val;
		this.ctx.translate(this.canvas.width, 0);
		this.ctx.rotate(Math.PI / 2);
	} else {
		this.canvas.width = val;
	}
};

var setHeight = function(val) {
	if (this.canvas.width < this.canvas.height) {
		this.canvas.width = val;
		this.ctx.translate(this.canvas.width, 0);
		this.ctx.rotate(Math.PI / 2);
	} else {
		this.canvas.height = val;
	}
};

var addEventListener = function(event, callback) {
	var that = this;
	this.canvas.addEventListener(event, function(e) {
		e.preventDefault();
		if (that.canvas.width < that.canvas.height) {
			var fakeEvent = {};
			fakeEvent.currentTarget = that;
			fakeEvent.targetTouches = [];
			for (var i = 0; i < e.targetTouches.length; i++) {
				var clientX = e.targetTouches[i].clientX;
				var clientY = e.targetTouches[i].clientY;
				fakeEvent.targetTouches[i] = {};
				fakeEvent.targetTouches[i].clientX = clientY;
				fakeEvent.targetTouches[i].clientY = that.canvas.width - clientX;
			}
			callback(fakeEvent);
		} else {
			callback(e);
		}
	});
};

var Canvas = function(zindex) {
	this.canvas = createCanvas(zindex);
	this.ctx = this.canvas.getContext('2d');
	this.ctx._canvas = this;

	this.getContext = getContext;
	this.addEventListener = addEventListener;
	this.__defineGetter__('width', getWidth);
	this.__defineGetter__('height', getHeight);
	this.__defineSetter__('width', setWidth);
	this.__defineSetter__('height', setHeight);
};

exports = Canvas;