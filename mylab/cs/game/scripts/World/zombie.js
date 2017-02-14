var Animation = imports('animation');

var draw = function(ctx, curTime) {
	if (this.currentStatus == null) return;
	if (curTime - this.hurtTime < 200) {
		this.currentStatus.showFilter = true;
	} else {
		this.currentStatus.showFilter = false;
	}
	this.currentStatus.x = this.x;
	this.currentStatus.y = this.y;
	this.currentStatus.setScale(this.z, this.z);
	this.currentStatus.draw(ctx, curTime);
};

var checkHit = function(x, y) {
	if (this.currentStatus == null) return;
	return this.currentStatus.checkHit(x, y);
};

var hurt = function() {
	if (this.currentStatus == null) return;
	if (this.hp <= 0) return;
	this.hurtTime = this.game.gameTimeline.getCurrentTime();
	this.hp -= 10;
	var that = this;
	if (this.hp <= 0) {
		this.currentStatus.stop();
		this.currentStatus = this.deadAnimation;
		this.currentStatus.playOnce().then(function() {
			that.alive = false;
		});
	}
};

var isWalking = function() {
	return this.currentStatus === this.walkAnimation;
};

var isRising = function() {
	return this.currentStatus === this.birthAnimation;
};

var beginAttack = function() {
	this.currentStatus.stop();
	this.currentStatus = this.attackAnimation;
	this.currentStatus.play();
};

var Zombie = function(game) {
	this.game = game;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.birthX = 0;
	this.birthY = 0;
	this.birthTime = game.gameTimeline.getCurrentTime();
	var originX = 313;
	var originY = 544;

	this.walkAnimation = new Animation(game.gameTimeline, assets('zombieWalk001'), 600, 600, 3000, originX, originY, true);
	this.attackAnimation = new Animation(game.gameTimeline, assets('zombieAttack001'), 600, 600, 1500, originX, originY, true);
	this.birthAnimation = new Animation(game.gameTimeline, assets('zombieBirth001'), 600, 600, 3000, originX, originY, true);
	this.deadAnimation = new Animation(game.gameTimeline, assets('zombieDead001'), 600, 600, 1000, originX, originY);
	this.walkAnimation.buildColorFilter(1, 0, 0, 1);
	this.attackAnimation.buildColorFilter(1, 0, 0, 1);
	this.birthAnimation.buildColorFilter(1, 0, 0, 1);
	this.currentStatus = null;
	this.hitMap = null;
	this.hitMapFrames = null;
	this.hurtTime = 0;
	this.hp = 30;
	this.alive = true; // alive 为 false 时会被world回收

	this.draw = draw;
	this.checkHit = checkHit;
	this.hurt = hurt;
	this.isWalking = isWalking;
	this.isRising = isRising;
	this.beginAttack = beginAttack;

	var that = this;
	that.currentStatus = that.birthAnimation;
	that.birthAnimation.playOnce().then(function() {
		that.currentStatus = that.walkAnimation;
		that.walkAnimation.play();
	});
};

exports = Zombie;