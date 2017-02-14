var Animation = imports('animation');

var draw = function(ctx) {
	this.gunAnimation.x = ctx._canvas.width / 2;
	this.gunAnimation.y = ctx._canvas.height - this.gunAnimation.height;
	if (this.gunAnimation.currentFrame == 1) {
		this.fireAnimation.x = ctx._canvas.width / 2 - 52;
		this.fireAnimation.y = ctx._canvas.height - this.gunAnimation.height + 47;
		this.fireAnimation.draw(ctx);
	}
	this.gunAnimation.draw(ctx, this.game.gameTimeline.getCurrentTime());
};

var onFire = function() {
	var that = this;
	// if (this.gunAnimation.playing) return;
	this.gunAnimation.playOnce().then(function() {
		that.fireAnimation.currentFrame = Math.floor(Math.random() * that.fireAnimation.frames.length);
		that.gunAnimation.currentFrame = 0;
	});
	this.game.dispatch('shock', {
		duration: 400,
		offset: 20,
		recoil: 0
	});
	this.game.dispatch('hit');
};

var Gun = function(game) {
	this.game = game;
	this.gunAnimation = new Animation(game.gameTimeline, assets('gunAnimation'), 720, 960, 500);
	this.fireAnimation = new Animation(game.gameTimeline, assets('gunFire'), 320, 640, 0);
	this.gunAnimation.width = 300;
	this.gunAnimation.height = this.gunAnimation.frameHeight / this.gunAnimation.frameWidth * this.gunAnimation.width;
	this.fireAnimation.width = 300;
	this.fireAnimation.height = this.gunAnimation.frameHeight / this.gunAnimation.frameWidth * this.gunAnimation.width;

	this.draw = draw;
	this.onFire = onFire;

	var that = this;
	game.on('fire', this.onFire, this);
};

exports = Gun;