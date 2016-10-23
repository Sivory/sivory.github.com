(function() {
	var r = 50;
	var left = 20;
	var bottom = 20;
	var weight = 4;
	var normalColor = 'rgba(255,255,255,.5)';
	var hoverColor = 'rgba(255,255,255,.3)';
	var little_R = 20;

	window.Joystick = function(cc) {
		this.joystickHover = false;
		this.joystickOffsetX = 0;
		this.joystickOffsetY = 0;
		this.touchStartX = 0;
		this.touchStartY = 0;
		this.curTouchId = -1;
		this.callbackCenter = cc;
	}

	Joystick.prototype.ontouchstart = function(e) {
		if (!this.joystickHover) {
			var touch = this.checkHoldJoystick(e);
			if (touch != null) {
				this.curTouchId = touch.identifier;
				this.joystickHover = true;
				this.touchStartX = touch.clientX;
				this.touchStartY = touch.clientY;
				return true;
			}
		}
		return false;
	}

	Joystick.prototype.ontouchmove = function(e) {
		if (this.joystickHover) {
			var touch = this.getCurTouch(e);
			var curX = touch.clientX;
			var curY = touch.clientY;
			this.joystickOffsetX = curX - this.touchStartX;
			this.joystickOffsetY = curY - this.touchStartY;
			var distanceToCenter = Util.getLength(0, 0, this.joystickOffsetX, this.joystickOffsetY);
			var maxDistance = r - little_R;
			if (distanceToCenter >= maxDistance) {
				this.joystickOffsetX = this.joystickOffsetX / distanceToCenter * maxDistance;
				this.joystickOffsetY = this.joystickOffsetY / distanceToCenter * maxDistance;
			}
			this.callbackCenter.trigger('aimMove', {
				x: this.joystickOffsetX,
				y: this.joystickOffsetY
			});
			return true;
		}
		return false;
	}

	Joystick.prototype.ontouchend = function(e) {
		if (this.joystickHover && this.getCurTouch(e) == null) {
			this.joystickHover = false;
			this.joystickOffsetX = 0;
			this.joystickOffsetY = 0;
			this.callbackCenter.trigger('aimMove', {
				x: 0,
				y: 0
			});
			return true;
		}
		return false;
	}

	Joystick.prototype.draw = function(ctx) {
		var color = this.joystickHover ? hoverColor : normalColor;
		Util.drawCircle(ctx, left + r, ctx.canvas.height - bottom - r, r, r - weight, normalColor);
		Util.drawCircle(ctx, left + r + this.joystickOffsetX, ctx.canvas.height - bottom - r + this.joystickOffsetY, little_R, 0, color);
	}

	Joystick.prototype.getCurTouch = function(e) {
		for (var i = 0; i < e.targetTouches.length; i++) {
			if (e.targetTouches[i].identifier == this.curTouchId) {
				return e.targetTouches[i];
			}
		}
		return null;
	}

	Joystick.prototype.checkHoldJoystick = function(e) {
		for (var i = 0; i < e.targetTouches.length; i++) {
			var clientX = e.targetTouches[i].clientX;
			var clientY = e.targetTouches[i].clientY;
			if (Util.getLength(left + r, e.currentTarget.height - bottom - r, clientX, clientY) <= little_R) {
				return e.targetTouches[i];
			}
		}
		return null;
	}

})();