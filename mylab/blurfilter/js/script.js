$(function() {
	$(window).mousemove(function(e) {
		var width = $('.frontground').width();
		var height = $('.frontground').height();
		$('.frontground').css({
			left: e.pageX - width / 2,
			top: e.pageY - height / 2
		});
	});
})