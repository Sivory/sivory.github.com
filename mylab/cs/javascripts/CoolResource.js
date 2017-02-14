(function() {
	var createResourceLoaderPromise = function(resItem, processUtil) {
		// 根据mime采用不同的加载策略
		switch (resItem.mime) {
			case "image/png":
			case "image/jpeg":
			case "image/gif":
				return new Promise(function(resolve, reject) {
					// 图片资源采用浏览器默认缓存机制
					var imageTemp = new Image();
					imageTemp.onerror = reject;
					imageTemp.onload = function() {
						resItem.content = imageTemp;
						processUtil.loaded++;
						processUtil.callback(processUtil.loaded, processUtil.total);
						resolve();
					};
					imageTemp.src = resItem.path + '?ver=' + resItem.version;
				});
			case "application/x-javascript":
				return new Promise(function(resolve, reject) {
					// javascript代码缓存在localStorage里面
					var localScriptVersion = localStorage.getItem('NAME.SIVORY#version of ' + resItem.path);
					var localScriptContent = localStorage.getItem('NAME.SIVORY#content of ' + resItem.path);
					if (localScriptVersion != null && localScriptContent != null && localScriptVersion === resItem.version) {
						// 缓存的代码为最新
						resItem.content = localScriptContent;
						processUtil.loaded++;
						processUtil.callback(processUtil.loaded, processUtil.total);
						resolve();
					} else {
						var client = new XMLHttpRequest();
						client.open("GET", resItem.path);
						client.onreadystatechange = function() {
							if (this.readyState !== 4) {
								return;
							}
							if (this.status === 200) {
								localStorage.setItem('NAME.SIVORY#version of ' + resItem.path, resItem.version);
								localStorage.setItem('NAME.SIVORY#content of ' + resItem.path, this.response);
								resItem.content = this.response;
								processUtil.loaded++;
								processUtil.callback(processUtil.loaded, processUtil.total);
								resolve();
							} else {
								reject(new Error(this.statusText));
							}
						};
						client.send();
					}
				});
			default:
				console.error('未知MIME:', resItem);
				break;
		}
	};

	var getResource = function(index) {
		if (this.resourceMap[index] != null) {
			return this.resourceMap[index].content;
		} else {
			console.error('找不到资源：' + index);
		}
	};

	// 返回一个promise
	var loadResources = function(versionPath) {
		var path = versionPath || '/version.json';
		var that = this;
		var processUtil = null;
		var promise = new Promise(function(resolve, reject) {
			// 加载version.json
			var client = new XMLHttpRequest();
			client.open("GET", path);
			client.onreadystatechange = function() {
				if (this.readyState !== 4) {
					return;
				}
				if (this.status === 200) {
					resolve(this.response);
				} else {
					reject(new Error(this.statusText));
				}
			};
			client.responseType = "json";
			client.setRequestHeader("Accept", "application/json");
			client.send();
		}).then(function(response) {
			var resList = response.resourceList;
			var promiseList = [];
			processUtil = {
				loaded: 0,
				total: resList.length,
				callback: that.processCallback || function(loaded, total) {
					console.log('resource loaded:' + loaded + '/' + total);
				}
			};
			for (var i = 0; i < resList.length; i++) {
				if (that.resourceMap[resList[i].index] != null) {
					throw new Error("资源标识冲突" + resList[i].index);
				}
				that.resourceMap[resList[i].index] = {
					path: resList[i].path,
					version: resList[i].version === '~' ? Math.floor(Math.random() * 100000) : resList[i].version,
					mime: resList[i].mime,
					content: null
				};
				promiseList.push(createResourceLoaderPromise(that.resourceMap[resList[i].index], processUtil));
			}
			return Promise.all(promiseList);
		}).catch(function(err) {
			console.error(err);
		});
		return promise;
	};

	var setProcessCallback = function(callback) {
		this.processCallback = callback;
	};

	var clear = function() {
		this.resourceMap = {};
	};

	window.CoolResource = function() {
		this.resourceMap = {};
		this.processCallback = null;

		this.getResource = getResource;
		this.loadResources = loadResources;
		this.setProcessCallback = setProcessCallback;
		this.clear = clear;
	};
})();