var start = function() {
	if (this.lastStartTime > this.lastStopTime) return;
	this.lastStartTime = (new Date()).getTime();
	this.offsetTime += this.lastStopTime - this.lastStartTime;
};

var stop = function() {
	if (this.lastStartTime <= this.lastStopTime) return;
	this.lastStopTime = (new Date()).getTime();
};

var getCurrentTime = function() {
	if (this.lastStartTime > this.lastStopTime) {
		return (new Date()).getTime() + this.offsetTime;
	} else {
		return this.lastStopTime + this.offsetTime;
	}
};

var Timeline = function() {
	this.offsetTime = 0;
	this.lastStartTime = 0;
	this.lastStopTime = 0;

	this.start = start;
	this.stop = stop;
	this.getCurrentTime = getCurrentTime;
};

exports = Timeline;