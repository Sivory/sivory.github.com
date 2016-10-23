(function() {

	var logList = [];
	Util = {
		getLength: function(x1, y1, x2, y2) {
			return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		},
		drawCircle: function(ctx, x, y, r1, r2, color) {
			ctx.fillStyle = color;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.arc(x, y, r1, 0, 2 * Math.PI, true);
			ctx.arc(x, y, r2, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();
		},
		log: function(msg) {
			logList.push(msg);
			while (logList.length > 20) logList.shift();
			$('#debuger').empty();
			for (var i = 0; i < logList.length; i++) {
				$('#debuger').append('<div>' + logList[i] + '</div>');
			}
		},
		checkInBox: function(x, y, rx, ry, rw, rh) {
			if (x < rx) return false;
			if (x > rx + rw) return false;
			if (y < ry) return false;
			if (y > ry + rh) return false;
			return true;
		}

	};
})();