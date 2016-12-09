var Util = imports('util');
var Canvas = imports('canvas');
var Joystick = imports('joystick');
var Sight = imports('sight');
var FireButton = imports('fireButton');
var Gun = imports('gun');

var initEvent = function() {
	var that = this;
	this.canvas.addEventListener('touchstart', function(e) {
		for (var i = 0; i < that.contents.length; i++) {
			if (that.contents[i].ontouchstart != null) {
				var res = that.contents[i].ontouchstart(e);
				if (res) break;
			}
		}
	});
	this.canvas.addEventListener('touchmove', function(e) {
		// e.preventDefault();
		for (var i = 0; i < that.contents.length; i++) {
			if (that.contents[i].ontouchmove != null) {
				var res = that.contents[i].ontouchmove(e);
				if (res) break;
			}
		}
	});
	this.canvas.addEventListener('touchend', function(e) {
		for (var i = 0; i < that.contents.length; i++) {
			if (that.contents[i].ontouchend != null) {
				var res = that.contents[i].ontouchend(e);
				if (res) break;
			}
		}
	});
};

var draw = function(ctx) {
	for (var i = 0; i < this.contents.length; i++) {
		if (this.contents[i].draw != null)
			this.contents[i].draw(ctx);
	}
};

var Controller = function(game) {
	this.game = game;
	this.canvas = new Canvas(2);
	this.ctx = this.canvas.getContext('2d');
	this.contents = [];

	this.contents.push(new Joystick(game));
	this.contents.push(new Sight(game));
	this.contents.push(new Gun(game));
	this.contents.push(new FireButton(game));

	this.initEvent = initEvent;
	this.draw = draw;

	this.initEvent();
	var that = this;
	game.on('refresh', function() {
		that.canvas.width = that.canvas.width;
		that.draw(that.ctx);
	});
};

exports = Controller;