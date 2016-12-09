var Animation = imports('animation');

var draw = function(ctx, curTime) {
	this.currentStatus.x = this.x;
	this.currentStatus.y = this.y;
	this.currentStatus.setScale(1, 1);
	this.currentStatus.draw(ctx, curTime);
};

var Zombie = function(game) {
	this.game = game;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	var originX = 313;
	var originY = 544;

	this.walkAnimation = new Animation(game.gameTimeline, assets('zombieWalk001'), 600, 600, 3000, originX, originY);
	this.attackAnimation = new Animation(game.gameTimeline, assets('zombieAttack001'), 600, 600, 1500, originX, originY);
	this.birthAnimation = new Animation(game.gameTimeline, assets('zombieBirth001'), 600, 600, 3000, originX, originY);
	this.deadAnimation = new Animation(game.gameTimeline, assets('zombieDead001'), 600, 600, 1000, originX, originY);
	this.currentStatus = null;

	this.draw = draw;

	var that = this;
	(function loop() {
		that.currentStatus = that.birthAnimation;
		that.birthAnimation.playOnce().then(function() {
			that.currentStatus = that.walkAnimation;
			return that.walkAnimation.playOnce();
		}).then(function() {
			that.currentStatus = that.attackAnimation;
			return that.attackAnimation.playOnce();
		}).then(function() {
			that.currentStatus = that.deadAnimation;
			return that.deadAnimation.playOnce();
		}).then(loop);
	})();
};

exports = Zombie;