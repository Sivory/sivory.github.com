var CallbackCenter = imports('callbackCenter');
var World = imports('world');
var Controller = imports('controller');
var Timeline = imports('timeline');

var startLoop = function(onTick, onDraw) {
	this.intervalID = setInterval(onTick, this.updateDelay);
	this.inLoop = true;
	var that = this;
	(function tick() {
		onDraw();
		if (that.inLoop) {
			requestAnimationFrame(tick);
		}
	})();
};

var stopLoop = function() {
	clearInterval(this.intervalID);
	this.inLoop = false;
};

var Game = function() {
	CallbackCenter.call(this);

	this.inLoop = false;
	this.intervalID = 0;
	this.updateDelay = 20;

	this.gameTimeline = new Timeline(); // 需要暂停
	this.uiTimeline = new Timeline(); // 无需暂停
	this.gameTimeline.start();
	this.uiTimeline.start();

	this.controller = new Controller(this);
	this.world = new World(this);

	this.startLoop = startLoop;
	this.stopLoop = stopLoop;

	var that = this;
	this.startLoop(function() {
		that.trigger('beforeUpdate');
		that.trigger('update');
		that.trigger('afterUpdate');
	}, function() {
		that.trigger('beforeRefresh');
		that.trigger('refresh');
		that.trigger('afterRefresh');
	});
};

exports = Game;