var Camera = imports('camera');
var Container = imports('container');
var Zombie = imports('zombie');
var Bitmap = imports('bitmap');
var Util = imports('util');
var Canvas = imports('canvas');

var draw = function(ctx, curTime) {
	ctx.save();
	ctx.scale(ctx._canvas.width / this.camera.width, ctx._canvas.height / this.camera.height);
	ctx.translate(-this.camera.x + this.camera.width / 2, -this.camera.y + this.camera.height / 2);
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].draw(ctx, curTime);
	}
	ctx.restore();
};

var update = function() {

};

var World = function(game) {
	Container.call(this);

	this.game = game;
	this.canvas = new Canvas(1);
	this.ctx = this.canvas.getContext('2d');
	this.camera = new Camera(game, this.ctx);

	this.update = update;
	this.draw = draw;

	this.background = new Bitmap(assets('b1'));
	this.background.x = -this.background.width / 2;
	this.background.y = -this.background.height / 2;
	this.addChild(this.background);
	this.camera.setRange(this.background.x, this.background.y, this.background.width, this.background.height);

	for (var i = 0; i < 20; i++) {
		var zombie = new Zombie(game);
		zombie.x = Math.random() * 1000 - 500;
		zombie.y = Math.random() * 400 - 200;
		this.addChild(zombie);
	}

	var that = this;
	game.on('refresh', function() {
		that.canvas.width = that.canvas.width;
		that.draw(that.ctx, game.gameTimeline.getCurrentTime());
	});
};

exports = World;