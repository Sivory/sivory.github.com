var Util = imports('util');

var r = 40;
var right = 30;
var bottom = 30;
var normalColor = 'rgba(255,255,255,.5)';
var hoverColor = 'rgba(255,255,255,.3)';

var FireButton = function(game) {
	this.hover = false;
	this.curTouchId = -1;
	this.game = game;
};

FireButton.prototype.ontouchstart = function(e) {
	if (!this.hover) {
		var touch = this.checkHoldFireButton(e);
		if (touch != null) {
			this.curTouchId = touch.identifier;
			this.hover = true;
			this.game.dispatch('fire');
			return true;
		}
	}
	return false;
};

FireButton.prototype.ontouchend = function(e) {
	if (this.hover && this.getCurTouch(e) == null) {
		this.hover = false;
		return true;
	}
	return false;
};

FireButton.prototype.draw = function(ctx) {
	var color = this.hover ? hoverColor : normalColor;
	Util.drawCircle(ctx, ctx._canvas.width - right - r, ctx._canvas.height - bottom - r, r, 0, color);
};

FireButton.prototype.getCurTouch = function(e) {
	for (var i = 0; i < e.targetTouches.length; i++) {
		if (e.targetTouches[i].identifier == this.curTouchId) {
			return e.targetTouches[i];
		}
	}
	return null;
};

FireButton.prototype.checkHoldFireButton = function(e) {
	for (var i = 0; i < e.targetTouches.length; i++) {
		var clientX = e.targetTouches[i].clientX;
		var clientY = e.targetTouches[i].clientY;
		if (Util.getLength(e.currentTarget.width - right - r, e.currentTarget.height - bottom - r, clientX, clientY) <= r) {
			return e.targetTouches[i];
		}
	}
	return null;
};

exports = FireButton;