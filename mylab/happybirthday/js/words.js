$(function(){

	var audioPlayer = document.getElementById('bg-player');
	var currentWordText = null;
	var lastWordText = null;
	setInterval(function(){
		var index = -1;
		for (var i=0;i<wordsList.length;i++) {
			if (wordsList[i].time <= audioPlayer.currentTime + 0.6 && (i==wordsList.length-1 || wordsList[i+1].time > audioPlayer.currentTime)) {
				index = i;
				break;
			}
		}
		if (index>currentIndex) {
			currentIndex = index;
			if (currentWordText!=null) {
				currentWordText.addClass('left');
			}
			if (lastWordText!=null) {
				lastWordText.remove();
			}
			lastWordText = currentWordText;
			currentWordText = $('<div class="word-sample right">').text(wordsList[currentIndex].word);
			if (currentIndex ==4) {
				setTimeout(function(){
					currentWordText.addClass('bigger');
				}, 1000);
				setTimeout(function(){
					currentWordText.removeClass('bigger');
				}, 1300);
			}
			$('body').prepend(currentWordText);
			setTimeout(function(){
				currentWordText.removeClass('right');
			},100);
		}
	}, 100);


	var wordsList = [];
	var currentIndex = -1;
	$.get('./music/bg2.lrc', null, function(response){
		var wordsTemp = response.split('\n');
		var reg = /\[(.*)\:(.*)\.(.*)\](.*)/;
		for (var i=0;i<wordsTemp.length;i++) {
			var e = reg.exec(wordsTemp[i]);
			var line = {
				time: (Number(e[1])*60*1000 + Number(e[2])*1000 + Number(e[3]))/1000,
				word: e[4]
			};
			wordsList[i] = line;
		}
	});
});