var Animation = imports('animation');

var draw = function(ctx) {
	this.animation.x = ctx._canvas.width/2-this.animation.width/2;
	this.animation.y = ctx._canvas.height/2-this.animation.height/2;
	this.animation.draw(ctx);
};

var Sight = function(game) {
	this.animation = new Animation(game.uiTimeline, assets('frontSight'), 103, 103, 0);
	this.animation.currentFrame = 1;
	this.animation.width = 48;
	this.animation.height = 48;

	this.draw = draw;
};

exports = Sight;