$(function() {
	setTimeout(function() {
		$('.background').addClass('show');
	}, 500);
	$('.icon-back').click(function() {
		$('.frontground').addClass('show');
		var delay = 0;
		$('.ccc').each(function() {
			var current = $(this);
			setTimeout(function() {
				current.addClass('show').css({
					left: '',
					top: ''
				});
			}, delay);
			delay += 50;
		});
	});
	$.get('./mylab/list.json', function(response) {
		if (response instanceof String)
			var data = JSON.parse(response);
		else
			var data = response;
		for (var i = 0; i < data.length; i++) {
			var expline = $('<div>').addClass('exp-line').appendTo('.exp-list');
			var expthumb = $('<img>').addClass('exp-thumb').appendTo(expline).attr('src', data[i].preview);
			var expname = $('<a>').addClass('exp-name').appendTo(expline).text(data[i].name).attr('href', data[i].position);
			var expdescription = $('<div>').addClass('exp-description').appendTo(expline).html(data[i].description);
			expname.get(0).target = "_blank";
		}
	});
});