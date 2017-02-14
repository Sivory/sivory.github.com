var setMoveRange = function(x, y, w, h) {
	this.rx = x;
	this.ry = y;
	this.rw = w;
	this.rh = h;
};

var refresh = function(ctx, curTime) {
	var deltaTime = this.game.uiTimeline.getCurrentTime() - this.lastRefreshTime;
	this.lastRefreshTime = this.game.uiTimeline.getCurrentTime();
	this._x += this.dx * deltaTime / 50;
	this._y += this.dy * deltaTime / 50;
	if (this._x < this.rx + this.width / 2) {
		this._x = this.rx + this.width / 2;
	}
	if (this._x > this.rx + this.rw - this.width / 2) {
		this._x = this.rx + this.rw - this.width / 2;
	}
	if (this._y < this.ry + this.height / 2) {
		this._y = this.ry + this.height / 2;
	}
	if (this._y > this.ry + this.rh - this.height / 2) {
		this._y = this.ry + this.rh - this.height / 2;
	}
	if (curTime - this.shockTime < this.shockDuration) {
		// 震动
		if (curTime - this.lastShockTime > 30) {
			var _shockOffset = (this.shockDuration - (curTime - this.shockTime)) / this.shockDuration * this.shockOffset;
			var _recoilDistance = (this.shockDuration - (curTime - this.shockTime)) / this.shockDuration * this.shockRecoil;
			this.x = this._x + Math.random() * _shockOffset - _shockOffset / 2;
			this.y = this._y + Math.random() * _shockOffset - _shockOffset / 2 - _recoilDistance;
			this.lastShockTime = curTime;
		}
	} else {
		// 不震动
		this.x = this._x;
		this.y = this._y;
	}
};

var onMove = function(pos) {
	this.dx = pos.x;
	this.dy = pos.y;
};

var onShock = function(shockParams) {
	this.shockDuration = shockParams.duration;
	this.shockOffset = shockParams.offset;
	this.shockRecoil = shockParams.recoil;
	this.shockTime = this.game.uiTimeline.getCurrentTime();
};

var Camera = function(game) {
	this.game = game;
	this._x = 0; // 用于记录震动的中心位置
	this._y = 0;
	this.x = 0;
	this.y = 0;
	this.width = 1000;
	this.height = 1000;
	this.rx = 0;
	this.ry = 0;
	this.rw = 0;
	this.rh = 0;
	this.dx = 0;
	this.dy = 0;
	this.lastRefreshTime = game.uiTimeline.getCurrentTime();
	this.lastShockTime = -1000;
	this.shockTime = -1000;
	this.shockDuration = 300;
	this.shockOffset = 30;
	this.shockRecoil = 10;

	this.setMoveRange = setMoveRange;
	this.refresh = refresh;
	this.onMove = onMove;
	this.onShock = onShock;

	game.on('moveCamera', this.onMove, this);
	game.on('shock', this.onShock, this);
};

exports = Camera;