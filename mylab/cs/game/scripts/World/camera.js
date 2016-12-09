var setRange = function(x, y, w, h) {
	this.rx = x;
	this.ry = y;
	this.rw = w;
	this.rh = h;
};

var Camera = function(game, ctx) {
	this.game = game;
	this.x = 0;
	this.y = 0;
	this.width = 1000;
	this.height = this.width / ctx._canvas.width * ctx._canvas.height;
	this.rx = 0;
	this.ry = 0;
	this.rw = 0;
	this.rh = 0;
	this.setRange = setRange;
	this.dx = 0;
	this.dy = 0;
	this.lastRefreshTime = game.uiTimeline.getCurrentTime();

	var that = this;
	game.on('moveCamera', function(pos) {
		that.dx = pos.x;
		that.dy = pos.y;
	});
	game.on('beforeRefresh', function() {
		that.height = that.width / ctx._canvas.width * ctx._canvas.height;
	});
	game.on('refresh', function() {
		var deltaTime = game.uiTimeline.getCurrentTime() - that.lastRefreshTime;
		that.lastRefreshTime = game.uiTimeline.getCurrentTime();
		that.x += that.dx * deltaTime / 50;
		that.y += that.dy * deltaTime / 50;
		if (that.x < that.rx + that.width / 2) {
			that.x = that.rx + that.width / 2;
		}
		if (that.x > that.rx + that.rw - that.width / 2) {
			that.x = that.rx + that.rw - that.width / 2;
		}
		if (that.y < that.ry + that.height / 2) {
			that.y = that.ry + that.height / 2;
		}
		if (that.y > that.ry + that.rh - that.height / 2) {
			that.y = that.ry + that.rh - that.height / 2;
		}
	});
};

exports = Camera;