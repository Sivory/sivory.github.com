var Widget = imports('widget');
var Picture = imports('picture');

var refresh = function(ctx) {
	this.background.width = ctx._canvas.width;
	this.background.height = ctx._canvas.height;
	for (var i=0;i<this.children.length;i++) {
		this.children[i].draw(ctx);
	}
};

var MainUI = function() {
	Widget.call(this);

	this.background = new Picture(assets('mainBackground'));
	this.background.size = 'cover';

	this.refresh = refresh;

	this.addChild(this.background);
};

exports = MainUI;