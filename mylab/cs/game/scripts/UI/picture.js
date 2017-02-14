var Widget = imports('widget');

var draw = function(ctx) {
	var sw = this.image.width;
	var sh = this.image.height;
	var tw = this.width;
	var th = this.height;
	switch (this.size) {
		case 'cover':
			if (sw / sh > tw / th) {
				sw = sh / th * tw;
				ctx.drawImage(this.image, (this.image.width - sw) / 2, 0, sw, sh, this.x, this.y, tw, th);
			} else {
				sh = sw / tw * th;
				ctx.drawImage(this.image, 0, (this.image.height - sh) / 2, sw, sh, this.x, this.y, tw, th);
			}
			break;
		case 'contain':
			if (sw / sh > tw / th) {
				th = tw / sw * sh;
				ctx.drawImage(this.image, 0, 0, sw, sh, this.x, this.y + (this.height - th) / 2, tw, th);
			} else {
				tw = th / sh * sw;
				ctx.drawImage(this.image, 0, 0, sw, sh, this.x + (this.width - tw) / 2, this.y, tw, th);
			}
			break;
		case 'fill':
			ctx.drawImage(this.image, 0, 0, sw, sh, this.x, this.y, tw, th);
			break;
		default:
			console.error('not valid Picture size:' + this.size);
			ctx.drawImage(this.image, 0, 0, sw, sh, this.x, this.y, sw, sh);
			break;
	}
};

var Picture = function(image) {
	Widget.call(this);

	this.size = 'fill';
	this.image = image;
	this.x = 0;
	this.y = 0;
	this.width = image.width;
	this.height = image.height;

	this.draw = draw;
};

exports = Picture;