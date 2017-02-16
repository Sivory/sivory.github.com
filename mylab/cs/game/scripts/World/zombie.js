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

	if (this.currentStatus != this.deadAnimation) {
		ctx.fillStyle = 'rgba(255,255,255,1)';
		var booldWidth = 120;
		if (this.maxhp >= 100) {
			booldWidth = 220;
		}
		ctx.fillRect(this.x - booldWidth / 2 * this.z - 2, this.y - 340 * this.z - 2, booldWidth * this.z + 4, 4 * this.z + 4);

		ctx.fillStyle = 'rgba(255,0,0,1)';
		ctx.fillRect(this.x - booldWidth / 2 * this.z, this.y - 340 * this.z, booldWidth * this.hp / this.maxhp * this.z, 4 * this.z);
	}
};

var checkHit = function(x, y) {
	if (this.currentStatus == null) return;
	return this.currentStatus.checkHit(x, y);
};

var hurt = function(damage) {
	if (this.currentStatus == null) return;
	if (this.hp <= 0) return;
	this.hurtTime = this.game.gameTimeline.getCurrentTime();
	this.hp -= damage;
	var that = this;
	if (this.hp <= 0) {
		this.hp = 0;
		this.currentStatus.stop();
		this.currentStatus = this.deadAnimation;
		this.currentStatus.playOnce().then(function() {
			that.alive = false;
		}).catch(function(err) {
			console.log(err);
		});
	}
};

var isWalking = function() {
	return this.currentStatus === this.walkAnimation;
};

var isRising = function() {
	return this.currentStatus === this.birthAnimation;
};

var isAttacking = function() {
	return this.currentStatus === this.attackAnimation;
};

var beginAttack = function() {
	this.attackTime = this.game.gameTimeline.getCurrentTime();
	this.currentStatus.stop();
	this.currentStatus = this.attackAnimation;
	this.currentStatus.playOnce().then((function() {
		this.currentStatus.currentFrame = 0;
	}).bind(this)).catch(function(err) {
		console.log(err);
	});
};

var updateAttackAction = function() {
	var curTime = this.game.gameTimeline.getCurrentTime();
	if (curTime - this.attackTime > this.attackDelay) {
		this.attackTime = curTime;
		var that = this;
		this.currentStatus.playOnce().then((function() {
			this.currentStatus.currentFrame = 0;
		}).bind(this)).catch(function(err) {
			console.log(err);
		});
	}
};

var Zombie = function(game, config) {
	this.game = game;
	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.walkAnimation = new Animation(game.gameTimeline, config.walkAnimation, 600, 600, config.walkAnimationDuration, config.animationOriginPoint.x, config.animationOriginPoint.y, true);
	this.attackAnimation = new Animation(game.gameTimeline, config.attackAnimation, 600, 600, config.attackAnimationDuration, config.animationOriginPoint.x, config.animationOriginPoint.y, true);
	this.birthAnimation = new Animation(game.gameTimeline, config.birthAnimation, 600, 600, config.birthAnimationDuration, config.animationOriginPoint.x, config.animationOriginPoint.y, true);
	this.deadAnimation = new Animation(game.gameTimeline, config.deadAnimation, 600, 600, config.deadAnimationDuration, config.animationOriginPoint.x, config.animationOriginPoint.y);
	this.walkAnimation.buildColorFilter(1, 0, 0, 1);
	this.attackAnimation.buildColorFilter(1, 0, 0, 1);
	this.birthAnimation.buildColorFilter(1, 0, 0, 1);
	this.currentStatus = null;
	this.hitMap = null;
	this.hitMapFrames = null;
	this.hurtTime = 0;
	this.hp = config.hp;
	this.maxhp = config.hp;
	this.alive = true; // alive 为 false 时会被world回收
	this.attackTime = -1000;
	this.attackDelay = 2000;

	this.draw = draw;
	this.checkHit = checkHit;
	this.hurt = hurt;
	this.isWalking = isWalking;
	this.isRising = isRising;
	this.isAttacking = isAttacking;
	this.beginAttack = beginAttack;
	this.updateAttackAction = updateAttackAction;

	var that = this;
	that.currentStatus = that.birthAnimation;
	that.birthAnimation.playOnce().then(function() {
		that.currentStatus = that.walkAnimation;
		that.walkAnimation.play();
	});
};

exports = Zombie;