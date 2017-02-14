var Camera = imports('camera');
var Container = imports('container');
var Zombie = imports('zombie');
var Bitmap = imports('bitmap');
var Util = imports('util');
var Canvas = imports('canvas');

var refresh = function(ctx) {
	var curTime = this.game.gameTimeline.getCurrentTime();
	this.camera.height = this.camera.width / ctx._canvas.width * ctx._canvas.height;
	this.camera.refresh(ctx, curTime);
	ctx.save();
	ctx.scale(ctx._canvas.width / this.camera.width, ctx._canvas.height / this.camera.height);
	ctx.translate(-this.camera.x + this.camera.width / 2, -this.camera.y + this.camera.height / 2);
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].draw(ctx, curTime);
	}
	for (var i = 0; i < this.zombies.length; i++) {
		this.zombies[i].draw(ctx, curTime);
	}
	ctx.restore();
};

var update = function() {
	this.checkCreateZombie();
	this.checkDeleteZombie();
	this.moveZombies();
	this.checkAimZombie();
};

var checkAimZombie = function() {
	var aim = false;
	var z = null;
	for (var i = this.zombies.length - 1; i >= 0; i--) {
		if (this.zombies[i].checkHit(this.camera.x, this.camera.y)) {
			aim = true;
			z = this.zombies[i];
			break;
		}
	}
	if (this.aimZombie == null && aim === true) {
		this.game.dispatch('aim');
		console.log('aim');
	}
	if (this.aimZombie != null && aim === false) {
		this.game.dispatch('notaim');
	}
	this.aimZombie = z;
};

var checkCreateZombie = function() {
	if ((Math.random() < 0.002 || this.zombies.length === 0) && this.zombies.length < 5) {
		var zombie = new Zombie(this.game);
		zombie.birthX = Math.random() * 640 - 320;
		zombie.birthY = Math.random() * 40 - 200;
		zombie.x = zombie.birthX;
		zombie.y = zombie.birthY;
		zombie.z = (zombie.y + 200) / 600 * 1 + 0.5;
		this.zombies.push(zombie);
	}
};

var checkDeleteZombie = function() {
	for (var i = 0; i < this.zombies.length; i++) {
		if (this.zombies[i].alive === false) {
			this.zombies.splice(i, 1);
			i--;
		}
	}
};

var moveZombies = function() {
	var curTime = this.game.gameTimeline.getCurrentTime();
	var duration = 30000;
	for (var i = 0; i < this.zombies.length; i++) {
		if (this.zombies[i].isWalking()) {
			if (curTime - this.zombies[i].birthTime < duration) {
				this.zombies[i].x = this.zombies[i].birthX + (this.zombies[i].birthX / 2 - this.zombies[i].birthX) * (curTime - this.zombies[i].birthTime) / duration;
				this.zombies[i].y = this.zombies[i].birthY + (400 - this.zombies[i].birthY) * (curTime - this.zombies[i].birthTime) / duration;
				this.zombies[i].z = (this.zombies[i].y + 200) / 600 * 1 + 0.5;
			} else {
				this.zombies[i].x = this.zombies[i].birthX / 2;
				this.zombies[i].y = 400;
				this.zombies[i].z = 1.5;
				this.zombies[i].beginAttack();
			}
		} else if (this.zombies[i].isRising()) {
			this.zombies[i].birthTime = curTime;
		}
	}
	this.zombies.sort(function(a, b) {
		return a.z - b.z;
	});
};

var onHit = function() {
	if (this.aimZombie != null) {
		this.aimZombie.hurt();
	}
};

var World = function(game) {
	Container.call(this);

	this.game = game;
	this.camera = new Camera(game);
	this.aimZombie = null;

	this.update = update;
	this.refresh = refresh;
	this.onHit = onHit;
	this.checkAimZombie = checkAimZombie;
	this.moveZombies = moveZombies;
	this.checkDeleteZombie = checkDeleteZombie;
	this.checkCreateZombie = checkCreateZombie;

	this.background = new Bitmap(assets('b1'));
	this.background.x = -this.background.width / 2;
	this.background.y = -this.background.height / 2;
	this.addChild(this.background);
	this.camera.setMoveRange(this.background.x, this.background.y, this.background.width, this.background.height);
	this.zombies = [];

	game.on('hit', this.onHit, this);
};

exports = World;