var Animation = imports('animation');

var draw = function(ctx) {
	var curTime = this.game.uiTimeline.getCurrentTime();
	console.log(curTime, this.shockTime, this.shockDuration);
	if (curTime - this.shockTime < this.shockDuration) {
		// 震动
		var _shockOffset = (this.shockDuration - (curTime - this.shockTime)) / this.shockDuration * 0.2;
		this.animation.setScale(0.4 + _shockOffset, 0.4 + _shockOffset);
		console.log('sss');
	} else {
		this.animation.setScale(0.4, 0.4);
	}
	this.animation.x = ctx._canvas.width / 2 - this.animation.width / 2;
	this.animation.y = ctx._canvas.height / 2 - this.animation.height / 2;
	this.animation.draw(ctx);
};

var onAim = function() {
	this.animation.currentFrame = 0;
};

var onNotAim = function() {
	this.animation.currentFrame = 1;
};

var onShock = function(shockParams) {
	console.log('sight shock');
	this.shockDuration = shockParams.duration;
	this.shockOffset = shockParams.offset;
	this.shockRecoil = shockParams.recoil;
	this.shockTime = this.game.uiTimeline.getCurrentTime();
};

var Sight = function(game) {
	this.game = game;
	this.animation = new Animation(game.uiTimeline, assets('frontSight'), 103, 103, 0);
	this.animation.currentFrame = 1;
	this.shockTime = -1000;
	this.shockDuration = 300;
	this.shockOffset = 30;
	this.shockRecoil = 10;

	this.draw = draw;
	this.onShock = onShock;

	game.on('aim', onAim, this);
	game.on('notaim', onNotAim, this);
	game.on('shock', onShock, this);
};

exports = Sight;