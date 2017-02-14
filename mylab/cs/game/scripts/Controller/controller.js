var Joystick = imports('joystick');
var Sight = imports('sight');
var FireButton = imports('fireButton');
var Gun = imports('gun');
var TouchableContainer = imports('touchableContainer');

var refresh = function(ctx) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].draw != null)
			this.children[i].draw(ctx);
	}
};

var Controller = function(game) {
	TouchableContainer.call(this);
	this.game = game;

	this.addChild(new Joystick(game));
	this.addChild(new Sight(game));
	this.addChild(new Gun(game));
	this.addChild(new FireButton(game));

	this.refresh = refresh;
};

exports = Controller;