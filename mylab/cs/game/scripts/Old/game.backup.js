var CallbackCenter = imports('callbackCenter');
var Background = imports('background');
var FireButton = imports('fireButton');
var Sight = imports('sight');
var Joystick = imports('joystick');
var Layer = imports('layer');
var World = imports('world');
var Zombie = imports('zombie');

var Game = function(c) {
	this.canvas = c;
	this.ctx = c.getContext('2d');
	this.contents = [];
	this.callbackCenter = new CallbackCenter();
	this.contents.push(new Background(this.callbackCenter));
	this.contents.push(new Joystick(this.callbackCenter));
	this.contents.push(new FireButton(this.callbackCenter));
	this.contents.push(new Sight(this.callbackCenter));
	this.initEvent();
	this.startMainLoop();

	this.layer = new Layer(this.canvas);
	this.world = new World();
	this.layer.addChild(this.world);
	this.zombie = new Zombie();
	this.world.addChild(this.zombie);
};

Game.prototype.initEvent = function() {
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
		e.preventDefault();
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


Game.prototype.draw = function() {
	this.canvas.width = this.canvas.width;
	for (var i = 0; i < this.contents.length; i++) {
		if (this.contents[i].draw != null)
			this.contents[i].draw(this.ctx);
	}
	if (this.layer) {
		this.layer.needRefresh = true;
		this.layer.refresh((new Date()).getTime());
	}
};

Game.prototype.update = function() {
	for (var i = 0; i < this.contents.length; i++) {
		if (this.contents[i].update != null)
			this.contents[i].update(this.ctx);
	}
};

Game.prototype.startMainLoop = function() {
	var that = this;
	(function tick() {
		that.update();
		that.draw();
		requestAnimationFrame(tick);
	})();
};

exports = Game;