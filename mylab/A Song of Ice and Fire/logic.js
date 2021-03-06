(function() {
	var currentIndex = 0;
	var currentScroll = 0;
	var targetPercent = 0;
	var currentPercent = 0;

	var startLoadingAnimation = function() {
		return new Promise(function(resolve, reject) {
			(function tick() {
				if (targetPercent > currentPercent + 2) currentPercent += 2;
				else if (targetPercent > currentPercent) currentPercent = targetPercent;
				$('.loading-process').css('width', currentPercent + '%');
				if (currentPercent < 100) {
					requestAnimationFrame(tick);
				} else {
					resolve();
				}
			})();
		});
	}

	var get = function(url) {
		// 返回一个新的 Promise
		return new Promise(function(resolve, reject) {
			// 经典 XHR 操作
			var req = new XMLHttpRequest();
			req.open('GET', url);

			req.onload = function() {
				// 当发生 404 等状况的时候调用此函数
				// 所以先检查状态码
				if (req.status == 200 || req.status == 304) {
					// 以响应文本为结果，完成此 Promise
					resolve(req.response);
				} else {
					// 否则就以状态码为结果否定掉此 Promise
					// （提供一个有意义的 Error 对象）
					reject(Error(req.statusText));
				}
			};

			// 网络异常的处理方法
			req.onerror = function() {
				reject(Error("Network Error"));
			};

			req.onprogress = function(e) {
				if (e.lengthComputable) {
					var percentComplete = e.loaded / e.total;
					targetPercent = percentComplete * 100;
				}
			};

			// 发出请求
			req.send();
		});
	}

	var loadAndSaveBookData = function() {
		return new Promise(function(resolve, reject) {
			var localCacheVersion = localStorage.getItem('book' + BOOK_INDEX + 'CacheVersion');
			if (localCacheVersion != null && CACHE_VERSION == Number(localCacheVersion)) {
				targetPercent = 100;
				resolve(JSON.parse(localStorage.getItem('book' + BOOK_INDEX + 'Cache')));
			} else {
				get('./book' + BOOK_INDEX + '.json').then(function(data) {
					targetPercent = 100;
					localStorage.setItem('book' + BOOK_INDEX + 'Cache', data);
					localStorage.setItem('book' + BOOK_INDEX + 'CacheVersion', CACHE_VERSION);
					resolve(JSON.parse(data));
				}, function(err) {
					reject(err);
				});
			}
		});
	}

	var loadStatus = function() {
		if (localStorage.getItem('lastIndex') != null) {
			currentIndex = Number(localStorage.getItem('lastIndex'));
		}
		if (localStorage.getItem('lastScroll') != null) {
			currentScroll = Number(localStorage.getItem('lastScroll'));
		}
	}

	var startAutoSaving = function() {
		setInterval(function() {
			currentScroll = $('body')[0].scrollTop;
			localStorage.setItem('lastIndex', currentIndex);
			localStorage.setItem('lastScroll', currentScroll);
		}, 3000);
	}

	var onTitleClick = function(e) {
		currentIndex = $(e.currentTarget).parent().prevAll('section').length;
		showChapter(currentIndex);
	}

	var initHTML = function(data) {
		return new Promise(function(resolve, reject) {
			var article = $('<article>').addClass('page');
			$('title').text(data.name);
			$('.book-container').empty().append(article);

			var targetCount = data.chapters.length;
			var count = 0;
			for (var i = 0; i < data.chapters.length; i++) {
				(function(chapterData) {
					setTimeout(function() {
						var sectionTemp = $('<section>').appendTo(article);
						var h3Temp = $('<h3>').addClass('p-title').text(chapterData.title).appendTo(sectionTemp);
						h3Temp.click(onTitleClick);
						var chapterTemp = $('<div>').addClass('p-chapter').appendTo(sectionTemp);
						chapterTemp.addClass('hide');
						for (var j = 0; j < chapterData.lines.length; j++) {
							var pTemp = $('<p>').addClass('p-line').appendTo(chapterTemp).text(chapterData.lines[j]);
						}
						count++;
						if (targetCount == count) {
							resolve();
						}
					}, 0);
				})(data.chapters[i]);
			}
		});
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

	var init = function() {
		loadStatus();
		$('.loading').addClass('show');
		$('.loading-text').text('读取中');
		Promise.all([loadAndSaveBookData(), startLoadingAnimation()]).then(function(data) {
			initHTML(data[0]).then(function() {
				$('.loading-text').text('读取完毕');
				setTimeout(function() {
					$('.loading').removeClass('show');
				}, 500);
				showChapter(currentIndex);
				$('body')[0].scrollTop = currentScroll;
				startAutoSaving();
			});
		}, function(err) {
			$('.loading-text').text('读取错误！');
			$('.loading').removeClass('show');
			console.error(err);
		});
	}

	$(init);
})();