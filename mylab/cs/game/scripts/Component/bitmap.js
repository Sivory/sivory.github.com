var draw = function(ctx) {
	ctx.drawImage(this.resource, 0, 0, this.resource.width, this.resource.height, this.x, this.y, this.width, this.height);
};

var Bitmap = function(res) {
	this.resource = res;
	this.draw = draw;
	this.x = 0;
	this.y = 0;
	this.width = this.resource.width;
	this.height = this.resource.height;
};

exports = Bitmap;