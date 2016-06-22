$(function() {
	var currentIndex = 0;
	var currentScroll = 0;
	if (localStorage.getItem('lastIndex') != null) {
		currentIndex = Number(localStorage.getItem('lastIndex'));
	}
	if (localStorage.getItem('lastScroll') != null) {
		currentScroll = Number(localStorage.getItem('lastScroll'));
	}
	var showChapter = function(index) {
		$('body')[0].scrollTop = 0;
		$('.p-chapter').addClass('hide');
		$('.p-title').addClass('hide').removeClass('openable');
		$('.p-chapter').eq(index).removeClass('hide');
		$('.p-title').eq(index).removeClass('hide');
		$('.p-title').eq(index + 1).removeClass('hide').addClass('openable');
		if (index - 1 >= 0) {
			$('.p-title').eq(index - 1).removeClass('hide').addClass('openable');
		}
	}
	$('.p-title').click(function(e) {
		currentIndex = $(e.currentTarget).parent().prevAll('section').length;
		showChapter(currentIndex);
	});
	showChapter(currentIndex);
	$('body')[0].scrollTop = currentScroll;
	setInterval(function(){
		currentScroll = $('body')[0].scrollTop;
		localStorage.setItem('lastIndex', currentIndex);
		localStorage.setItem('lastScroll', currentScroll);
	}, 10000);
});