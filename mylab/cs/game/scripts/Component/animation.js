var DEFAULT_HIT_MAP_CELLSIZE = 10;

var imageDataCache = {};
var colorFilterCache = {};
var hitMapCache = {};

var draw = function(ctx, currentTime) {
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
	var ty = (this.y - this.originY / this.frameHeight * this.height + 0.5) << 0;
	var sx = this.frames[this.currentFrame].x;
	var sy = this.frames[this.currentFrame].y;
	var sw = this.frames[this.currentFrame].w;
	var sh = this.frames[this.currentFrame].h;
	if (this.showFilter && this.filterTemp != null) {
		ctx.drawImage(this.filterTemp, sx, sy, sw, sh, tx, ty, tw, th);
	} else {
		ctx.drawImage(this.resource, sx, sy, sw, sh, tx, ty, tw, th);
	}
	// debug
	// if (this.hitMap != null) {
	// 	var hitSize = this.hitMapCellSize * tw / sw;
	// 	var sxIndex = (sx / this.hitMapCellSize) << 0;
	// 	var syIndex = (sy / this.hitMapCellSize) << 0;
	// 	var swCount = (sw / this.hitMapCellSize) << 0;
	// 	var shCount = (sh / this.hitMapCellSize) << 0;
	// 	for (var i = 0; i < shCount; i++) {
	// 		for (var j = 0; j < swCount; j++) {
	// 			if (this.hitMap[syIndex + i][sxIndex + j] === 1) {
	// 				ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
	// 				ctx.fillRect(tx + j * hitSize + 1, ty + i * hitSize + 1, hitSize - 2, hitSize - 2);
	// 			}
	// 		}
	// 	}
	// }
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
	this.scaleX = x;
	this.scaleY = y;
	this.width = this.frameWidth * this.scaleX;
	this.height = this.frameHeight * this.scaleY;
};

var checkHit = function(x, y) {
	if (this.hitMap == null) {
		return false;
	}
	var _x = (x - this.x) / this.scaleX + this.originX;
	var _y = (y - this.y) / this.scaleY + this.originY;
	if (_x < 0 || _x > this.frameWidth || _y < 0 || _y > this.frameHeight) return false;
	var sx = this.frames[this.currentFrame].x;
	var sy = this.frames[this.currentFrame].y;
	var sxIndex = (sx / this.hitMapCellSize) << 0;
	var syIndex = (sy / this.hitMapCellSize) << 0;
	var xIndex = (_x / this.hitMapCellSize) << 0;
	var yIndex = (_y / this.hitMapCellSize) << 0;
	if (this.hitMap[syIndex + yIndex] == null) return false;
	return this.hitMap[syIndex + yIndex][sxIndex + xIndex] === 1;
};

var buildImageData = function() {
	if (this.imageData == null) {
		if (imageDataCache[this.resource.src] != null) {
			this.imageData = imageDataCache[this.resource.src];
		} else {
			var c = document.createElement("canvas");
			c.width = this.resource.width;
			c.height = this.resource.height;
			var ctx = c.getContext("2d");
			ctx.drawImage(this.resource, 0, 0);
			this.imageData = ctx.getImageData(0, 0, c.width, c.height);
			imageDataCache[this.resource.src] = this.imageData;
		}
	}
};

var buildHitMap = function(size) {
	if (size == null)
		size = DEFAULT_HIT_MAP_CELLSIZE;
	this.hitMapCellSize = size;
	this.buildImageData();
	var cacheIndex = this.resource.src + '#' + size;
	if (hitMapCache[cacheIndex] != null) {
		this.hitMap = hitMapCache[cacheIndex];
	} else {
		var mapWidth = (this.imageData.width / this.hitMapCellSize) << 0;
		var mapHeight = (this.imageData.height / this.hitMapCellSize) << 0;
		this.hitMap = [];
		for (var i = 0; i < mapHeight; i++) {
			this.hitMap[i] = [];
			for (var j = 0; j < mapWidth; j++) {
				var pixalRow = i * this.hitMapCellSize + (this.hitMapCellSize >> 1);
				var pixalCol = j * this.hitMapCellSize + (this.hitMapCellSize >> 1);
				var pixalIndex = pixalRow * this.imageData.width + pixalCol;
				if (this.imageData.data[pixalIndex * 4 + 3] > 128) {
					// 透明度高于0.5
					this.hitMap[i][j] = 1;
				} else {
					this.hitMap[i][j] = 0;
				}
			}
		}
		hitMapCache[cacheIndex] = this.hitMap;
	}
};

var buildColorFilter = function(r, g, b, a) {
	var cacheIndex = this.resource.src + '#' + r + '#' + g + '#' + b + '#' + a;
	if (colorFilterCache[cacheIndex] != null) {
		this.filterTemp = colorFilterCache[cacheIndex];
	} else {
		var c = document.createElement('canvas');
		c.width = this.resource.width;
		c.height = this.resource.height;
		var ctx = c.getContext('2d');
		this.buildImageData();
		var _imageData = ctx.createImageData(c.width, c.height);
		for (var i = 0; i < this.imageData.height; i++) {
			for (var j = 0; j < this.imageData.width; j++) {
				var pixalIndex = i * this.imageData.width + j;
				_imageData.data[pixalIndex * 4 + 0] = this.imageData.data[pixalIndex * 4 + 0] * r << 0;
				_imageData.data[pixalIndex * 4 + 1] = this.imageData.data[pixalIndex * 4 + 1] * g << 0;
				_imageData.data[pixalIndex * 4 + 2] = this.imageData.data[pixalIndex * 4 + 2] * b << 0;
				_imageData.data[pixalIndex * 4 + 3] = this.imageData.data[pixalIndex * 4 + 3] * a << 0;
			}
		}
		ctx.putImageData(_imageData, 0, 0);
		this.filterTemp = c;
		colorFilterCache[cacheIndex] = this.filterTemp;
	}
};

var Animation = function(timeline, res, frameWidth, frameHeight, duration, originX, originY, hitable) {
	this.timeline = timeline;
	this.resource = res;
	this.frames = [];
	this.duration = duration;
	this.x = 0;
	this.y = 0;
	this.scaleX = 1;
	this.scaleY = 1;
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
	this.hitMapCellSize = DEFAULT_HIT_MAP_CELLSIZE;
	this.hitMap = null;
	this.filterTemp = null;
	this.showFilter = false;
	this.imageData = null;

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
	this.buildImageData = buildImageData;
	this.buildHitMap = buildHitMap;
	this.checkHit = checkHit;
	this.buildColorFilter = buildColorFilter;

	this.setScale = setScale;

	if (hitable) {
		this.buildHitMap();
	}
};

exports = Animation;