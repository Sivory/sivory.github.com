var draw = function(context, currentTime) {
	// 确定当前播放的帧
	if (this.playing) {
		var circlepast = (currentTime - this.startTime) / this.duration;
		if (circlepast >= 1 && this.repeat === false) {
			this.currentFrame = this.frames.length - 1;
			this.playing = false;
			if (this.__onceDoneCB) {
				this.__onceDoneCB();
				this.__onceDoneCB = null;
				this.__onceCancelCB = null;
			}
		} else {
			circlepast = circlepast - Math.floor(circlepast);
			this.currentFrame = Math.floor(circlepast * this.frames.length);
		}
	}
	// 确定绘制大小和位置
	var tw = (this.width + 0.5) << 0;
	var th = (this.height + 0.5) << 0;
	var tx = (this.x - this.originX / this.frameWidth * this.width + 0.5) << 0;
	var ty = (this.y - this.originY / this.frameHeight * this.width + 0.5) << 0;
	var sx = this.frames[this.currentFrame].x;
	var sy = this.frames[this.currentFrame].y;
	var sw = this.frames[this.currentFrame].w;
	var sh = this.frames[this.currentFrame].h;
	context.drawImage(this.resource, sx, sy, sw, sh, tx, ty, tw, th);
};

var play = function() {
	this.repeat = true;
	this.startTime = this.timeline.getCurrentTime();
	this.playing = true;
};

var playOnce = function() {
	this.repeat = false;
	this.startTime = this.timeline.getCurrentTime();
	this.playing = true;
	var that = this;
	return new Promise(function(resolve, reject) {
		that.__onceDoneCB = resolve;
		that.__onceCancelCB = reject;
	});
};

var stop = function() {
	this.playing = false;
	if (this.__onceCancelCB) {
		this.__onceCancelCB();
		this.__onceDoneCB = null;
		this.__onceCancelCB = null;
	}
};

var setScale = function(x, y) {
	this.width = this.frameWidth * x;
	this.height = this.frameHeight * y;
};

var Animation = function(timeline, res, frameWidth, frameHeight, duration, originX, originY) {
	this.timeline = timeline;
	this.resource = res;
	this.frames = [];
	this.duration = duration;
	this.x = 0;
	this.y = 0;
	this.originX = originX || 0;
	this.originY = originY || 0;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	this.width = frameWidth;
	this.height = frameHeight;
	this.currentFrame = 0;
	this.repeat = false;
	this.playing = false;
	this.startTime = 0;
	this.__onceDoneCB = null;
	this.__onceCancelCB = null;

	var frameCount = res.width / frameWidth;
	for (var i = 0; i < frameCount; i++) {
		var frameTemp = {
			x: i * this.frameWidth,
			y: 0,
			w: this.frameWidth,
			h: this.resource.height
		};
		this.frames.push(frameTemp);
	}

	this.draw = draw;
	this.play = play;
	this.playOnce = playOnce;
	this.stop = stop;

	this.setScale = setScale;
};

exports = Animation;