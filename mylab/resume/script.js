var UI_loading = function() {
	var back = $('<div>').addClass('loading-back');
	var loadingContainer = $('<div>').addClass('loading-container').appendTo(back);
	var loading = $('<div>').addClass('loading').appendTo(loadingContainer);
	var inner = $('<canvas>').addClass('loading-inner').attr({
		width: 132,
		height: 132
	}).appendTo(loadingContainer);
	var context = inner.get(0).getContext('2d');
	var setPercent = function(percent) {
		if (percent > 1) percent = 1;
		context.globalCompositeOperation = 'source-over';
		context.fillStyle = '#fff';
		context.fillRect(0, 0, 132, 132);
		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.arc(66, 66, 66, -Math.PI * .5, Math.PI * 2 - Math.PI * .5);
		context.arc(66, 66, 62, Math.PI * 2 - Math.PI * .5, -Math.PI * .5, true);
		context.moveTo(66, 66);
		context.arc(66, 66, 64, -Math.PI * .5, Math.PI * 2 * percent - Math.PI * .5);
		context.arc(66, 66, 58, Math.PI * 2 * percent - Math.PI * .5, -Math.PI * .5, true);
		context.closePath();
		context.fill();
	}
	var timer = null;
	var currentPercent = 0;
	var targetPercent = 0;
	var success = null;
	back.startLoading = function() {
		timer = setInterval(function() {
			if (currentPercent < targetPercent) currentPercent += .01;
			else if (targetPercent == 1) {
				loadingContainer.css({
					'transition': '',
					'transform': 'scale(1,1)',
				});
				back.css({
					'transition': '',
					opacity: 1,
					visibility: 'visible'
				});
				setTimeout(function() {
					loadingContainer.css({
						'transition': 'all .5s',
						'transform': 'scale(0.4,0.4)',
					});
					back.css({
						'transition': 'all .5s',
						opacity: 0,
						visibility: 'hidden'
					});
				}, 0);
				clearInterval(timer);
				setTimeout(function() {
					if ( !! success) success();
				}, 500);
			}
			setPercent(currentPercent);
		}, 20);
	}
	back.setPercent = function(percent) {
		targetPercent = percent;
	}
	back.setSuccess = function(callback) {
		success = callback;
	}
	return back;
}

UI_loading.instance = new UI_loading();



var UI_Resource = function(resList) {
	var totalSize = 0;
	this.resourceList = resList;
	this.load = function(callback) {
		UI_loading.instance.startLoading();
		UI_loading.instance.setSuccess(callback);
		for (var i = 0; i < resList.length; i++) {
			totalSize += resList[i].size;
			resList[i].loaded = 0;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', resList[i].url);
			xhr.send();
			xhr.res = resList[i];
			xhr.responseType = 'arraybuffer';
			xhr.onprogress = function(e) {
				e.target.res.loaded = e.loaded;
				var loadedSize = 0;
				for (var i = 0; i < resList.length; i++) {
					loadedSize += resList[i].loaded;
				}
				UI_loading.instance.setPercent(loadedSize / totalSize);
			}
			xhr.onload = function(e) {
				var blob = new Blob([e.target.response], {
					type: e.target.res.mime
				});
				e.target.res.url = URL.createObjectURL(blob);
			}
			xhr.onerror = function() {
				alert('错误');
			}
		}
	}
}

UI_Resource.instance = new UI_Resource([{
	url: './back.jpg',
	size: 424130,
	mime: 'image/jpeg'
}, {
	url: './front.jpg',
	size: 82729,
	mime: 'image/jpeg'
}, {
	url: './logo.jpg',
	size: 22599,
	mime: 'image/jpeg'
}, {
	url: './a1.png',
	size: 11556,
	mime: 'image/png'
}, {
	url: './a2.png',
	size: 11809,
	mime: 'image/png'
}, {
	url: './a3.png',
	size: 11193,
	mime: 'image/png'
}, {
	url: './a4.png',
	size: 30539,
	mime: 'image/png'
}, {
	url: './a5.png',
	size: 11460,
	mime: 'image/png'
}, {
	url: './a6.png',
	size: 8612,
	mime: 'image/png'
}, {
	url: './work1.png',
	size: 6040,
	mime: 'image/png'
}]);



var UI_Footer = function() {
	var footer = $('<div>').addClass('footer');
	footer.html('<span><i class="fa fa-envelope"></i> <a href="mailto:sivory@qq.com">sivory@qq.com</a> <i style="margin:0 15px;">|</i> <i class="fa fa-phone"></i> <a href="tel:18566696964">18566696964</a> <i style="margin:0 15px;">|</i> <a id="full-screen-cheacker">Would you please press the F11 key :-)</a> </span>');
	return footer;
}

UI_Footer.instance = new UI_Footer();



var UI_Content = function() {
	var content = $('<div>').addClass('content');
	content.__animate = function(s, e, isShow) {
		var _ins = this;
		var duration = 1000;
		_ins.css({
			transition: '',
			visibility: isShow ? 'hidden' : 'visible',
			opacity: isShow ? 0 : 1,
			transform: 'rotate(' + s + 'deg)',
			'transform-origin': '50% 150%'
		});
		setTimeout(function() {
			_ins.css({
				transition: 'all ' + duration + 'ms',
				visibility: isShow ? 'visible' : 'hidden',
				opacity: isShow ? 1 : 0,
				transform: 'rotate(' + e + 'deg)',
				'transform-origin': '50% 150%'
			});
		}, 20);
		setTimeout(function() {
			if (isShow)
				_ins.addClass('shown');
			else
				_ins.removeClass('shown');
		}, duration);
	}
	content.rightIn = function() {
		this.__animate(20, 0, true);
	}
	content.leftIn = function() {
		this.__animate(-20, 0, true);
	}
	content.rightOut = function() {
		this.__animate(0, 20, false);
	}
	content.leftOut = function() {
		this.__animate(0, -20, false);
	}
	return content;
}



var UI_Content_Profile = function() {
	var fContent = new UI_Content();
	fContent.addClass('profile');
	fContent.html('<div class="wrench-container"><div class="wrench fa fa-user"></div><div class="wrench-circle-1"></div><div class="wrench-circle-2"></div></div>');
	var avatar = $('<img>').addClass('avatar').attr('src', UI_Resource.instance.resourceList[2].url).appendTo(fContent);
	var profileTitle = $('<div>').addClass('title').html('<span>Sivory</span> 的个人信息').appendTo(fContent);
	var profileContent = $('<div>').addClass('profile-list').appendTo(fContent);
	var profileLineName = $('<div>').addClass('profile-line').html('<span class="bold">姓名：</span><span class="fix-up">王威</span>').appendTo(profileContent);
	var profileLineSex = $('<div>').addClass('profile-line').html('<span class="bold">性别：</span><span class="fix-up">男</span>').appendTo(profileContent);
	var profileLineHometown = $('<div>').addClass('profile-line').html('<span class="bold">籍贯：</span><span class="fix-up">江苏金湖</span>').appendTo(profileContent);
	var profileLineWorkcity = $('<div>').addClass('profile-line').html('<span class="bold">所在城市：</span><span class="fix-up">深圳</span>').appendTo(profileContent);
	var profileLineEducation = $('<div>').addClass('profile-line').html('<span class="bold">学历：</span><span class="fix-up">本科</span>').appendTo(profileContent);
	var profileLineProfession = $('<div>').addClass('profile-line').html('<span class="bold">专业：</span><span class="fix-up">软件工程</span>').appendTo(profileContent);
	var profileLineSchool = $('<div>').addClass('profile-line').html('<span class="bold">毕业院校：</span><span class="fix-up">厦门大学</span>').appendTo(profileContent);
	var profileLineCompany = $('<div>').addClass('profile-line').html('<span class="bold">就职于：</span><span class="fix-up">腾讯</span>').appendTo(profileContent);
	var profileLineBirthday = $('<div>').addClass('profile-line').html('<span class="bold">出生日期：</span><span class="fix-up">1990年12月23日</span>').appendTo(profileContent);
	var profileLineExpect = $('<div>').addClass('profile-line').html('<span class="bold">期望职业：</span><span class="fix-up">WEB/游戏前端工程师</span>').appendTo(profileContent);
	fContent.doSomething = function() {
		initFixUp(fContent);
		setTimeout(function() {
			doFixUp(fContent);
		}, 2000);
	}
	return fContent;
}

var UI_Content_Ability = function() {
	var aContent = new UI_Content();
	aContent.addClass('ability');
	aContent.html('<div class="wrench-container"><div class="wrench fa fa-flask"></div><div class="wrench-circle-1"></div><div class="wrench-circle-2"></div></div>');
	var abilityTitle = $('<div>').addClass('title').html('<span>Sivory</span> 的前端技能').appendTo(aContent);
	var abilityContent = $('<div>').addClass('ability-list').appendTo(aContent);
	$('<div>').addClass('ability-icon').append($('<img>').attr('src', UI_Resource.instance.resourceList[3].url)).append($('<div>').text('HTML5')).appendTo(abilityContent);
	$('<div>').addClass('ability-icon').append($('<img>').attr('src', UI_Resource.instance.resourceList[4].url)).append($('<div>').text('CSS3.0')).appendTo(abilityContent);
	$('<div>').addClass('ability-icon').append($('<img>').attr('src', UI_Resource.instance.resourceList[5].url)).append($('<div>').text('Javascript')).appendTo(abilityContent);
	$('<div>').addClass('ability-icon').append($('<img>').attr('src', UI_Resource.instance.resourceList[7].url)).append($('<div>').text('Mongodb数据库')).appendTo(abilityContent);
	$('<div>').addClass('ability-icon').append($('<img>').attr('src', UI_Resource.instance.resourceList[6].url)).append($('<div>').text('Photoshop制图')).appendTo(abilityContent);
	$('<div>').addClass('ability-icon').append($('<img>').attr('src', UI_Resource.instance.resourceList[8].url)).append($('<div>').text('Node.js服务器')).appendTo(abilityContent);
	aContent.doSomething = function() {
		$('.ability-icon').css({
			left: '',
			top: '',
			transition: '',
			opacity: '',
			visibility: '',
			transform: 'rotate(360deg)'
		});
		setTimeout(function() {
			var delay = 0;
			for (var i = 0; i < 6; i++) {
				(function(i) {
					setTimeout(function() {
						$('.ability-icon').eq(i).css({
							left: i % 3 * 205 + 25,
							top: Math.floor(i / 3) * 190 + 10,
							opacity: 1,
							visibility: 'visible',
							transition: 'all .5s',
							transform: ''
						});
					}, delay += 200);
				})(i);
			}
		}, 2000);
	}
	aContent.endSomething = function() {
		$('.ability-icon').css({
			left: '',
			top: '',
			transition: 'all .5s',
			opacity: '',
			visibility: '',
			transform: 'rotate(360deg)'
		});
	}
	return aContent;
}

var UI_Content_Honer = function() {
	var hContent = new UI_Content();
	hContent.addClass('honer');
	hContent.html('<div class="wrench-container"><div class="wrench fa fa-trophy"></div><div class="wrench-circle-1"></div><div class="wrench-circle-2"></div></div>');
	var honerTitle = $('<div>').addClass('title').html('<span>Sivory</span> 的个人荣誉').appendTo(hContent);
	var honerContent = $('<div>').addClass('honer-list').appendTo(hContent);
	$('<div>').addClass('honer-line').appendTo(honerContent).html('<span>2010.</span>厦门大学机器人拼接大赛.<strong>第一名</strong>');
	$('<div>').addClass('honer-line').appendTo(honerContent).html('<span>2010.</span>厦门大学软件设计大赛.<strong>第二名</strong>');
	$('<div>').addClass('honer-line').appendTo(honerContent).html('<span>2010.</span>厦门大学程序设计竞赛.<strong>三等奖</strong>');
	$('<div>').addClass('honer-line').appendTo(honerContent).html('<span>2011.</span>第二届大学生服务外包大赛.<strong>三等奖</strong>');
	$('<div>').addClass('honer-line').appendTo(honerContent).html('<span>2012.</span>第三届大学生服务外包大赛.<strong>三等奖</strong>');
	$('<div>').addClass('honer-line').appendTo(honerContent).html('<span>2012.</span>第五届 Intel 杯软件创新大赛.<strong>一等奖</strong>');
	hContent.doSomething = function() {
		$('.honer-line').css({
			transition: '',
			opacity: '',
			visibility: '',
			transform: 'perspective(360px) scale3d(0,0,0) rotateY(360deg)'
		});
		setTimeout(function() {
			var delay = 0;
			for (var i = 0; i < 6; i++) {
				(function(i) {
					setTimeout(function() {
						$('.honer-line').eq(i).css({
							opacity: 1,
							visibility: 'visible',
							transition: 'all 1s',
							transform: 'perspective(360px) scale3d(1,1,1) rotateY(0deg)'
						});
					}, delay += 200);
				})(i);
			}
		}, 2000);
	}
	hContent.endSomething = function() {
		$('.honer-line').css({
			transition: 'all .5s',
			opacity: '',
			visibility: '',
			transform: 'perspective(360px) scale3d(0,0,0) rotateY(360deg)'
		});
	}
	return hContent;
}


var UI_Content_Works = function(name, video, description) {
	var wContent = new UI_Content();
	wContent.addClass('works');
	wContent.html('<div class="wrench-container"><div class="wrench fa fa-plane"></div><div class="wrench-circle-1"></div><div class="wrench-circle-2"></div></div>');
	var worksTitle = $('<div>').addClass('title').html('<span>作品</span> ' + name).appendTo(wContent);
	var worksDiscription = $('<div>').addClass('discription').html(description).appendTo(wContent);
	var worksVideo = $('<div>').addClass('video').data('video', video).appendTo(wContent);
	wContent.doSomething = function() {
		var _ins = this;
		var videoUrl = $(_ins).find('.video').data('video');
		setTimeout(function() {
			var iframe = $('<object height="440" width="640" type="application/x-shockwave-flash" data="http://player.youku.com/player.php/sid/' + videoUrl + '/v.swf"><param name="src" value="http://player.youku.com/player.php/sid/' + videoUrl + '/v.swf" /></object>');
			$(_ins).find('.video').append(iframe);
		}, 1000);
	}
	wContent.endSomething = function() {
		var _ins = this;
		$(_ins).find('.video').empty();
	}
	return wContent;
}

var UI_Content_Works_Mobile = function(name, pic, description) {
	var wContent = new UI_Content();
	wContent.addClass('works');
	wContent.html('<div class="wrench-container"><div class="wrench fa fa-plane"></div><div class="wrench-circle-1"></div><div class="wrench-circle-2"></div></div>');
	var worksTitle = $('<div>').addClass('title').html('<span>作品</span> ' + name).appendTo(wContent);
	var worksDiscription = $('<div>').addClass('discription').html(description).appendTo(wContent);
	var worksVideo = $('<div>').addClass('video').data('image', pic).appendTo(wContent);
	wContent.doSomething = function() {
		var _ins = this;
		var videoUrl = $(_ins).find('.video').data('image');
		var iframe = $('<img src="' + videoUrl + '">');
		setTimeout(function() {
			$(_ins).find('.video').append(iframe);
		}, 1000);
	}
	wContent.endSomething = function() {
		var _ins = this;
		$(_ins).find('.video').empty();
	}
	return wContent;
}

var UI_Content_Last = function() {
	var lContent = new UI_Content();
	lContent.addClass('last');
	var wordsContent = $('<div>').css({
		width: 560,
		height: 120,
		position: 'absolute',
		left: '50%',
		top: '50%',
		'margin-left': -230,
		'margin-top': -60
	}).appendTo(lContent);
	var words1 = $('<div>').addClass('fix-up').css({
		'font-size': 36,
		'margin-bottom': '20px'
	}).text('前端程序猿是什么？').appendTo(wordsContent);
	var words2 = $('<div>').addClass('fix-up').css({
		'font-size': 36
	}).text('总之不仅仅是做网页的。').appendTo(wordsContent);
	var link1 = $('<a href="https://github.com/Sivory/pal.js" target="_blank"><i class="fa fa-mail-forward"></i> 访问Sivory的《仙剑奇侠传》HTML5重制项目（开源）</a>').css({
		visibility: 'hidden',
		opacity: 0,
		position: 'absolute',
		left: 0,
		top: 140,
		'text-shadow': '0 0 10px rgba(0,0,0,.2)'
	}).appendTo(wordsContent);
	var link2 = $('<a href="http://zibianliang.com/" target="_blank"><i class="fa fa-mail-forward"></i> 访问Sivory的创业博客《自变量》</a>').css({
		visibility: 'hidden',
		opacity: 0,
		position: 'absolute',
		left: 0,
		top: 170,
		'text-shadow': '0 0 10px rgba(0,0,0,.2)'
	}).appendTo(wordsContent);
	var link3 = $('<a href="http://v.youku.com/v_show/id_XMjMyMDE1MzI4.html" target="_blank"><i class="fa fa-mail-forward"></i> 访问Sivory的UDK作品《天界》</a>').css({
		visibility: 'hidden',
		opacity: 0,
		position: 'absolute',
		left: 0,
		top: 200,
		'text-shadow': '0 0 10px rgba(0,0,0,.2)'
	}).appendTo(wordsContent);
	var link4 = $('<a href="http://www.huochejiayuan.com.cn/" target="_blank"><i class="fa fa-mail-forward"></i> 访问Sivory曾参与的创业项目《货车家园网》</a>').css({
		visibility: 'hidden',
		opacity: 0,
		position: 'absolute',
		left: 0,
		top: 230,
		'text-shadow': '0 0 10px rgba(0,0,0,.2)'
	}).appendTo(wordsContent);
	var link5 = $('<a href="https://github.com/Sivory/sivory.github.com" target="_blank"><i class="fa fa-mail-forward"></i> 访问本站点源代码</a>').css({
		visibility: 'hidden',
		opacity: 0,
		position: 'absolute',
		left: 0,
		top: 260,
		color: '#800',
		'text-shadow': '0 0 10px rgba(0,0,0,.2)'
	}).appendTo(wordsContent);
	lContent.doSomething = function() {
		var element = $(this);
		initFixUp(element);
		setTimeout(function() {
			doFixUp(element, 200);
		}, 1000);
		setTimeout(function() {
			link1.css({
				transition: 'all .3s',
				visibility: 'visible',
				opacity: 1
			})
		}, 6000);
		setTimeout(function() {
			link2.css({
				transition: 'all .3s',
				visibility: 'visible',
				opacity: 1
			})
		}, 6300);
		setTimeout(function() {
			link3.css({
				transition: 'all .3s',
				visibility: 'visible',
				opacity: 1
			})
		}, 6600);
		setTimeout(function() {
			link4.css({
				transition: 'all .3s',
				visibility: 'visible',
				opacity: 1
			})
		}, 6900);
		setTimeout(function() {
			link5.css({
				transition: 'all .3s',
				visibility: 'visible',
				opacity: 1
			})
		}, 7200);
	};
	lContent.endSomething = function() {
		var element = $(this);
		initFixUp(element);
		link1.css({
			transition: '',
			visibility: 'hidden',
			opacity: 0
		})
		link2.css({
			transition: '',
			visibility: 'hidden',
			opacity: 0
		})
		link3.css({
			transition: '',
			visibility: 'hidden',
			opacity: 0
		})
		link4.css({
			transition: '',
			visibility: 'hidden',
			opacity: 0
		})
		link5.css({
			transition: '',
			visibility: 'hidden',
			opacity: 0
		})
	}
	return lContent;
}


var initFixUp = function(element) {
	element.find('.fix-up').each(function() {
		var str = $(this).text();
		$(this).empty();
		for (var i = 0; i < str.length; i++) {
			var spanTemp = $('<span>').text(str[i]).appendTo($(this));
			var x = Math.floor(Math.random() * 20) - 10;
			var y = Math.floor(Math.random() * 20) - 10;
			spanTemp.css({
				display: 'inline-block',
				transform: 'translate(' + x + 'px,' + y + 'px)',
				opacity: 0,
				visibility: 'hidden'
			});
		}
	});
}

var doFixUp = function(element, tick) {
	if (tick == null) tick = 50;
	var delay = 0;
	element.find('.fix-up span').each(function() {
		var _ins = this;
		setTimeout(function() {
			$(_ins).css({
				transition: 'all .5s',
				transform: '',
				opacity: 1,
				visibility: 'visible'
			});
		}, delay);
		delay += tick;
	});
}

var UI_Left_Arrow = function() {
	var leftArrow = $('<div>').addClass('left-arrow fa fa-angle-left');
	leftArrow.click(function() {
		showContentPage(contentPointer - 1);
	});
	return leftArrow;
}
UI_Left_Arrow.instance = new UI_Left_Arrow();

var UI_Right_Arrow = function() {
	var rightArrow = $('<div>').addClass('right-arrow fa fa-angle-right');
	rightArrow.click(function() {
		showContentPage(contentPointer + 1);
	});
	return rightArrow;
}
UI_Right_Arrow.instance = new UI_Right_Arrow();

var contentList = [];
var contentPointer = -1;
var animationBlocker = false;

var showContentPage = function(index) {
	if (animationBlocker) return;
	if (contentPointer < index && index < contentList.length) {
		animationBlocker = true;
		var delay = 0;
		if (contentPointer > -1) {
			contentList[contentPointer].leftOut();
			if ( !! contentList[contentPointer].endSomething)
				contentList[contentPointer].endSomething();
			delay = 500;
		}
		setTimeout(function() {
			contentList[index].rightIn();
			if ( !! contentList[index].doSomething)
				contentList[index].doSomething();
			contentPointer = index;
			animationBlocker = false;
		}, delay);
	} else if (index < contentPointer && index > -1) {
		animationBlocker = true;
		var delay = 500;
		contentList[contentPointer].rightOut();
		if ( !! contentList[contentPointer].endSomething)
			contentList[contentPointer].endSomething();
		setTimeout(function() {
			contentList[index].leftIn();
			if ( !! contentList[index].doSomething)
				contentList[index].doSomething();
			contentPointer = index;
			animationBlocker = false;
		}, delay);
	}
}

$(function() {
	$('body').append(UI_loading.instance);
	UI_Resource.instance.load(function() {
		var layer1 = $('<div>').addClass('back-layer').css({
			'background': 'url(' + UI_Resource.instance.resourceList[0].url + ') center no-repeat',
			'opacity': 0
		}).appendTo('body');
		var layer2 = $('<div>').addClass('back-layer').css({
			'background': 'url(' + UI_Resource.instance.resourceList[1].url + ') center no-repeat',
			'opacity': 0
		}).appendTo('body');
		$('body').append(UI_Footer.instance);
		UI_Footer.instance.css({
			'transform': 'translate(0,30px)'
		});
		$('body').append(UI_Left_Arrow.instance);
		UI_Left_Arrow.instance.css({
			'transform': 'translate(-100px,0px)'
		});
		$('body').append(UI_Right_Arrow.instance);
		UI_Right_Arrow.instance.css({
			'transform': 'translate(100px,0px)'
		});
		setTimeout(function() {
			layer1.css({
				'transition': 'all 1s',
				opacity: 1
			});
		}, 100);
		setTimeout(function() {
			UI_Footer.instance.css({
				'transition': 'all .5s',
				'transform': 'translate(0,0px)'
			});
			UI_Left_Arrow.instance.css({
				'transition': 'all .5s',
				'transform': 'translate(0,0px)'
			});
			UI_Right_Arrow.instance.css({
				'transition': 'all .5s',
				'transform': 'translate(0,0px)'
			});
			var contentProfile = new UI_Content_Profile();
			var contentAbility = new UI_Content_Ability();
			var contentHoner = new UI_Content_Honer();
			var contentWorks1 = new UI_Content_Works('MovingCastle 游戏引擎',
				'XNTI5NTEzNjAw',
				'<span>作品简介:</span> 基于HTML5技术开发的在线RPG游戏引擎。采用javascript语言编写。可实现在线资源管理、在线开发、在线调试、在线试玩。<a href="http://112.124.96.115/" target="_blank">传送门</a>');
			var contentWorks2 = new UI_Content_Works('MovingCastle 游戏展示',
				'XNTI5NTEyNDA0',
				'<span>作品简介:</span> 利用MovingCastle开发的在线RPG游戏展示。<a href="http://112.124.96.115/Game/FB73D086912082BD754492C727C30340" target="_blank">传送门</a>');
			var contentWorks3 = new UI_Content_Works('酷零浏览器',
				'XMjM3MTA4MTcy',
				'<span>作品简介:</span> 基于C#开发的一款浏览器。采用Webkit内核与WPF技术实现。');
			var contentWorks4 = new UI_Content_Works('酷零音乐播放器',
				'XNDQxMDc3OTY0',
				'<span>作品简介:</span> 基于C语言开发的一款播放器。采用Windows API与DirectShow技术实现。(我还有小小露脸哦~)');
			var contentWorks5 = new UI_Content_Works_Mobile('集美旅游微官网', UI_Resource.instance.resourceList[9].url,
				'<span>作品简介:</span> 为集美旅游局定制的集美旅游微官网，接入微信平台提供服务。主要采用CSS3.0技术实现。');
			var contentLast = new UI_Content_Last();
			$('body').append(contentProfile);
			$('body').append(contentAbility);
			$('body').append(contentHoner);
			$('body').append(contentWorks1);
			$('body').append(contentWorks2);
			$('body').append(contentWorks3);
			$('body').append(contentWorks4);
			$('body').append(contentWorks5);
			$('body').append(contentLast);
			contentList.push(contentProfile);
			contentList.push(contentAbility);
			contentList.push(contentHoner);
			contentList.push(contentWorks1);
			contentList.push(contentWorks2);
			contentList.push(contentWorks3);
			contentList.push(contentWorks4);
			contentList.push(contentWorks5);
			contentList.push(contentLast);
			showContentPage(0);
		}, 1000);
		setTimeout(function() {
			layer2.css({
				'transition': 'all 2s',
				opacity: 1
			});
		}, 100);
	});
})

$(window).bind('wheel', function(e, f) {
	e.preventDefault();
})

window.addEventListener('resize', function(e) {
	if (window.innerWidth == window.screen.width && window.innerHeight == window.screen.height || window.innerHeight == window.screen.height - 1) {
		$('#full-screen-cheacker').text('Thank you! :-D');
	} else {
		$('#full-screen-cheacker').text('Would you please press the F11 key :-)');
	}
});