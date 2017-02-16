var EventDispatcher = imports('eventDispatcher');
var World = imports('world');
var Controller = imports('controller');
var Timeline = imports('timeline');
var TouchableContainer = imports('touchableContainer');
var Canvas = imports('canvas');
var MainUI = imports('mainUI');
var GameData = imports('gameData');

var startLoop = function(onTick, onDraw, thisObject) {
	var that = this;
	// this.intervalID = setInterval(function() {
	// 	onTick.call(that);
	// }, this.updateDelay);
	this.inLoop = true;
	(function tick() {
		onTick.call(that);
		onDraw.call(that);
		if (that.inLoop) {
			requestAnimationFrame(tick);
		}
	})();
};

var stopLoop = function() {
	clearInterval(this.intervalID);
	this.inLoop = false;
};

var initEvent = function() {
	var that = this;
	this.canvas.addEventListener('touchstart', function(e) {
		that.ontouchstart(e);
	});
	this.canvas.addEventListener('touchmove', function(e) {
		that.ontouchmove(e);
	});
	this.canvas.addEventListener('touchend', function(e) {
		that.ontouchend(e);
	});
};

var Game = function() {
	EventDispatcher.call(this);
	TouchableContainer.call(this);

	this.inLoop = false;
	this.intervalID = null;
	this.updateDelay = 20;
	this.canvas = new Canvas(0);
	this.data = new GameData();

	this.gameTimeline = new Timeline(); // 需要暂停
	this.uiTimeline = new Timeline(); // 无需暂停

	this.controller = new Controller(this);
	this.world = new World(this);
	this.mainUI = new MainUI(this);

	this.startLoop = startLoop;
	this.stopLoop = stopLoop;
	this.initEvent = initEvent;

	this.gameTimeline.start();
	this.uiTimeline.start();
	this.initEvent();
	this.addChild(this.world);
	this.addChild(this.controller);
	// this.addChild(this.mainUI);

	this.startLoop(function() {
		this.dispatch('beforeUpdate');
		this.dispatch('update');
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].update != null) {
				var res = this.children[i].update.call(this.children[i]);
				if (res) break;
			}
		}
		this.dispatch('afterUpdate');
	}, function() {
		this.canvas.width = this.canvas.width;
		this.dispatch('beforeRefresh');
		this.dispatch('refresh');
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].refresh != null) {
				var res = this.children[i].refresh.call(this.children[i], this.canvas.ctx);
				if (res) break;
			}
		}
		this.dispatch('afterRefresh');
	});
};

exports = Game;