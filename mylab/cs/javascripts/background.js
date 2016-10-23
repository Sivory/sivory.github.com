(function() {
	var url = './images/b1.png';

	var actorList = [
		'./images/Zombie_Dolls_001.png',
		'./images/Zombie_Dolls_002.png',
		'./images/Zombie_Dolls_003.png',
		'./images/Zombie_Dolls_004.png',
		'./images/Zombie_Dolls_005.png',
		'./images/Zombie_Dolls_006.png',
		'./images/Zombie_Dolls_007.png',
		'./images/Zombie_Dolls_008.png',
		'./images/Zombie_Dolls_009.png'
	];


	window.Background = function(callbackCenter) {
		this.aimPosX = 0;
		this.aimPosY = 0;
		var that = this;
		callbackCenter.register('aimPos', function(aimInfo) {
			that.onAimPos(aimInfo);
		});
		callbackCenter.register('fire', function() {
			that.onFire();
		});
		this.image = new Image();
		this.image.src = url;
		this.actors = [];
	}

	Background.prototype.onAimPos = function(aimInfo) {
		this.aimPosX = aimInfo.x;
		this.aimPosY = aimInfo.y;
	}

	Background.prototype.onFire = function() {
		var checkX = this.aimPosX + window.innerWidth / 2;
		var checkY = this.aimPosY + window.innerHeight / 2;
		for (var i = this.actors.length - 1; i >= 0; i--) {
			if (this.actors[i].image.complete && this.actors[i].deadScale == null) {
				if (Util.checkInBox(checkX, checkY, this.actors[i].area_x, this.actors[i].area_y, this.actors[i].area_w, this.actors[i].area_h)) {
					this.actors[i].deadScale = 1;
					break;
				}
			}
		}
	}

	Background.prototype.update = function() {
		if (Math.random() < 0.02 && this.actors.length < 5) {
			var image = new Image();
			var index = Math.floor(Math.random() * 9);
			console.log(index, actorList[index]);
			image.src = actorList[index];
			this.actors.push({
				image: image,
				x: Math.random() * 300 - 150,
				y: Math.random() * 40,
				scale: 0.1,
				area_x: 0,
				area_y: 0,
				area_w: 0,
				area_h: 0
			});
		}
		for (var i = 0; i < this.actors.length; i++) {
			if (this.actors[i].deadScale == null) {
				this.actors[i].scale += 0.001;
				if (this.actors[i].scale >= 0.4) {
					this.actors.splice(i, 1);
					i--;
				}
			} else {
				this.actors[i].deadScale -= 0.05;
				if (this.actors[i].deadScale <= 0) {
					this.actors.splice(i, 1);
					i--;
				}
			}
		}
		this.actors.sort(function(a, b) {
			return a.scale - b.scale;
		});
	}

	Background.prototype.draw = function(ctx) {
		if (this.image.complete) {
			var srcWidth = this.image.width;
			var srcHeight = this.image.height;
			var tarWidth = ctx.canvas.width;
			var tarHeight = ctx.canvas.height;
			var width = tarWidth;
			var height = srcHeight / srcWidth * tarWidth;
			if (height < tarHeight) {
				height = tarHeight;
				width = srcWidth / srcHeight * tarHeight;
			}
			var drawWidth = width * 1.2;
			var drawHeight = height * 1.2;
			var startX = tarWidth / 2 - drawWidth / 2 - this.aimPosX / (tarWidth / 2) * width * 0.1;
			var startY = tarHeight / 2 - drawHeight / 2 - this.aimPosY / (tarHeight / 2) * height * 0.1;
			ctx.drawImage(this.image, startX, startY, drawWidth, drawHeight);

			for (var i = 0; i < this.actors.length; i++) {
				if (this.actors[i].image.complete) {
					var w = this.actors[i].image.width * this.actors[i].scale;
					var h = this.actors[i].image.height * this.actors[i].scale;
					var x = tarWidth / 2 + this.actors[i].x - w / 2 - this.aimPosX / (tarWidth / 2) * width * 0.1;
					var y = tarHeight / 2 + this.actors[i].y - h / 2 - this.aimPosY / (tarHeight / 2) * height * 0.1;
					if (this.actors[i].deadScale != null) {
						y += h * (1 - this.actors[i].deadScale);
						h = h * this.actors[i].deadScale;
					}
					ctx.drawImage(this.actors[i].image, x, y, w, h);
					this.actors[i].area_x = x;
					this.actors[i].area_y = y;
					this.actors[i].area_w = w;
					this.actors[i].area_h = h;
				}
			}
		}
	}

})();