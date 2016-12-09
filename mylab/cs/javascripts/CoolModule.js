(function() {
	var runScript = function() {
		var _$_$_$_$_ = this; // 这么奇葩的变量名是为了防止eval中出现重名
		var exports = null;
		var imports = function(index) {
			return _$_$_$_$_.require(index);
		};
		var assets = function(index) {
			if (_$_$_$_$_.resource.getResource(index) == null) throw new Error('找不到资源'+index);
			return _$_$_$_$_.resource.getResource(index);
		};
		eval(_$_$_$_$_.currentScripts);
		_$_$_$_$_._module[_$_$_$_$_.currentIndex] = exports;
	};

	var require = function(index) {
		if (this._module[index] != null) {
			return this._module[index];
		} else if (this.resource.resourceMap[index] != null && this.resource.resourceMap[index].mime === 'application/x-javascript') {
			if (index === this.currentIndex) {
				throw new Error("不能引用自己");
			}
			var scriptsTemp = this.currentScripts;
			var indexTemp = this.currentIndex;
			this.currentScripts = this.resource.resourceMap[index].content;
			this.currentIndex = index;
			this.runScript();
			this.currentScripts = scriptsTemp;
			this.currentIndex = indexTemp;
			return this._module[index];
		} else {
			throw new Error('找不到名为' + index + '的脚本');
		}
	};

	window.CoolModule = function(resource) {
		this.resource = resource;
		this._module = {};
		this.currentIndex = null;
		this.currentScripts = null;

		this.require = require;
		this.runScript = runScript;
	};
})();