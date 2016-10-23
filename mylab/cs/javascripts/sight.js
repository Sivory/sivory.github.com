(function() {
	var normalColor = 'rgba(255,255,255,.5)';
	var len = 20;
	var width = 4;

	window.Sight = function(callbackCenter) {
		this.posX = 0;
		this.posY = 0;
		this.aimMoveX = 0;
		this.aimMoveY = 0;
		var that = this;
		this.callbackCenter = callbackCenter;
		this.callbackCenter.register('aimMove', function(aimInfo) {
			that.onAim(aimInfo);
		});
	}

	Sight.prototype.update = function(ctx) {
		this.posX += this.aimMoveX / 10;
		this.posY += this.aimMoveY / 10;
		if (this.posX < -ctx.canvas.width / 2) this.posX = -ctx.canvas.width / 2;
		if (this.posX > ctx.canvas.width / 2) this.posX = ctx.canvas.width / 2;
		if (this.posY < -ctx.canvas.height / 2) this.posY = -ctx.canvas.height / 2;
		if (this.posY > ctx.canvas.height / 2) this.posY = ctx.canvas.height / 2;
		this.callbackCenter.trigger('aimPos', {
			x: this.posX,
			y: this.posY
		});
	}

	Sight.prototype.onAim = function(aimInfo) {
		this.aimMoveX = aimInfo.x;
		this.aimMoveY = aimInfo.y;
	}

	Sight.prototype.draw = function(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = normalColor;
		ctx.lineWidth = width;
		ctx.moveTo(ctx.canvas.width / 2 + this.posX, ctx.canvas.height / 2 - len + this.posY);
		ctx.lineTo(ctx.canvas.width / 2 + this.posX, ctx.canvas.height / 2 + len + this.posY);
		ctx.moveTo(ctx.canvas.width / 2 - len + this.posX, ctx.canvas.height / 2 + this.posY);
		ctx.lineTo(ctx.canvas.width / 2 + len + this.posX, ctx.canvas.height / 2 + this.posY);
		ctx.stroke();
	}

})();