var UI_loading = function() {
	var back = $('<div>').addClass('loading-back');
	var loading = $('<div>').addClass('loading').appendTo(back);
	var inner = $('<canvas>').addClass('loading-inner').attr({
		width: 132,
		height: 132
	}).appendTo(back);
	var context = inner.get(0).getContext('2d');
	back.setPercent = function(percent) {
		if (percent > 1) percent = 1;
		context.globalCompositeOperation = 'source-over';
		context.fillStyle = '#fff';
		context.fillRect(0, 0, 132, 132);
		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.arc(66, 66, 66, -Math.PI * .5, Math.PI * 2 - Math.PI * .5);
		context.arc(66, 66, 56, Math.PI * 2 - Math.PI * .5, -Math.PI * .5, true);
		context.moveTo(66, 66);
		context.arc(66, 66, 58, -Math.PI * .5, Math.PI * 2 * percent - Math.PI * .5);
		context.arc(66, 66, 50, Math.PI * 2 * percent - Math.PI * .5, -Math.PI * .5, true);
		context.closePath();
		context.fill();
	}
	return back;
}

var Resource = function(resList) {
	var totalSize = 0;
	this.load = function() {
		for (var i = 0; i < resList.length; i++) {
			totalSize += resList[i].size;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', resList[i].url);
			xhr.send();
			xhr.th = i;
			xhr.responseType = 'blob';
			xhr.onload = function(e) {
				console.log('load', e);
			}
			xhr.onprogress = function(e) {
				console.log('progress', e);
			}
			xhr.onerror = function() {
				alert('加载错误');
			}
		}
	}
}

$(function() {
	var loading = new UI_loading;
	$('body').append(loading);
	var percent = 0;
	var timer = setInterval(function() {
		percent += 0.008;
		loading.setPercent(percent);
		if (percent > 1) {
			clearInterval(timer);
			loading.css({
				'-webkit-transition': 'all .5s',
				'-webkit-transform': 'scale3d(1,1,1)',
				opacity: 1,
				visibility: 'visible'
			});
			setTimeout(function() {
				loading.css({
					'-webkit-transform': 'scale3d(0,0,1)',
					opacity: 0,
					visibility: 'hidden'
				});
			}, 0);
		}
	}, 10);
	var resource = new Resource([{
		url: './back.jpg',
		size: '355123'
	}, {
		url: './front.jpg',
		size: '219401'
	}]);
	resource.load();
})