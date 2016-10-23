(function() {
	var game = null;
	$(function() {
		$('#game-container').get(0).width = window.innerWidth;
		$('#game-container').get(0).height = window.innerHeight;
		game = new Game($('#game-container')[0]);

		window.addEventListener('resize', function() {
			$('#game-container').get(0).width = window.innerWidth;
			$('#game-container').get(0).height = window.innerHeight;
		});
	});
})();