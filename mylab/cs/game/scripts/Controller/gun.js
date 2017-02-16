var Animation = imports('animation');

var draw = function(ctx) {
	this.gunAnimation.x = ctx._canvas.width - 260;
	this.gunAnimation.y = ctx._canvas.height - 240;
	if (this.gunAnimation.currentFrame == 1) {
		this.fireAnimation.x = this.gunAnimation.x + this.fireX;
		this.fireAnimation.y = this.gunAnimation.y + this.fireY;
		this.fireAnimation.draw(ctx);
	}
	// ctx.fillStyle = 'rgba(0,0,0,.2)';
	// ctx.fillRect(this.gunAnimation.x, this.gunAnimation.y, this.gunAnimation.width, this.gunAnimation.height);
	this.gunAnimation.draw(ctx, this.game.gameTimeline.getCurrentTime());
};

var onFire = function() {
	if (this.oneShoot) {
		this.shoot();
	}
};

var onOpenFire = function() {
	this.openFire = true;
};

var onCeaseFire = function() {
	this.openFire = false;
};

var update = function() {
	if (!this.oneShoot && this.openFire) {
		this.shoot();
	}
};

var shoot = function() {
	var curTime = this.game.gameTimeline.getCurrentTime();
	if (curTime - this.lastShootTime < this.shootDelay) return;
	this.lastShootTime = curTime;
	var that = this;
	this.gunAnimation.playOnce().then(function() {
		that.fireAnimation.currentFrame = Math.floor(Math.random() * that.fireAnimation.frames.length);
		that.gunAnimation.currentFrame = 0;
	});
	this.game.dispatch('shock', {
		duration: 400,
		offset: 20,
		recoil: 20,
		shake: this.shakeDistance
	});
	this.game.dispatch('hit', this.damage);
};

var Gun = function(game, gunConfig) {
	this.game = game;
	this.oneShoot = gunConfig.oneShoot;
	this.shootDelay = gunConfig.shootDelay;
	this.openFire = false;
	this.damage = gunConfig.damage;
	this.lastShootTime = -1000;
	this.shakeDistance = gunConfig.shakeDistance || 0;
	this.gunAnimation = new Animation(game.gameTimeline, gunConfig.animation, 900, 900, gunConfig.fireDuration);
	this.fireAnimation = new Animation(game.gameTimeline, assets('gunFire'), 320, 640, 0, 196, 333);
	this.gunAnimation.setScale(300 / this.gunAnimation.frameWidth, 300 / this.gunAnimation.frameWidth);
	this.fireAnimation.setScale(180 / this.fireAnimation.frameWidth, 180 / this.fireAnimation.frameWidth);
	this.fireX = gunConfig.fireX * this.gunAnimation.width / this.gunAnimation.frameWidth;
	this.fireY = gunConfig.fireY * this.gunAnimation.height / this.gunAnimation.frameHeight;

	this.draw = draw;
	this.update = update;
	this.onFire = onFire;
	this.onOpenFire = onOpenFire;
	this.onCeaseFire = onCeaseFire;
	this.shoot = shoot;

	game.on('fireOnce', this.onFire, this);
	game.on('openFire', this.onOpenFire, this);
	game.on('ceaseFire', this.onCeaseFire, this);
};

exports = Gun;