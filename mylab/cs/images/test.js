var http = require('http');
var fs = require('fs');

var fileList = [
	'leve1background.png',
	'stand-sheet1.png',
	'stand-sheet2.png',
	'stand-sheet0.png',
	'down-sheet0.png',
	'button-sheet0.png',
	'button-sheet1.png',
	'pistol-sheet1.png',
	'pistol-sheet0.png',
	'gun-sheet0.png',
	'cur-sheet0.png',
	'cur-sheet1.png',
	'cur-sheet2.png',
	'shake-sheet0.png',
	'hut-sheet0.png',
	'hbar-sheet0.png',
	'startpage.png',
	'level3background.png',
	'level2background.png',
	'car1-sheet0.png',
	'car2-sheet0.png',
	'ly-sheet0.png',
	'ly-sheet1.png',
	'bar2-sheet0.png',
	'level5background.png',
	'grass-sheet0.png',
	'down2-sheet0.png',
	'cur2-sheet0.png',
	'cur2-sheet1.png',
	'healthpack-sheet0.png',
	'block-sheet0.png',
	'box-sheet0.png',
	'scope-sheet0.png',
	'black.png',
	'pink-sheet0.png',
	'spiner-sheet0.png',
	'red-sheet0.png',
	'truck2-sheet0.png',
	'tiledbackground.png',
	'win-sheet0.png',
	'shield-sheet0.png',
	'down3-sheet0.png',
	'down3-sheet1.png',
	'sprite5-sheet0.png',
	'sprite6-sheet0.png',
	'sprite7-sheet0.png',
	'sprite4-sheet0.png',
	'tiledbackground3.png',
	'tiledbackground4.png',
	't2-sheet0.png',
	'barrel-sheet0.png',
	'sprite8-sheet0.png',
	'blast-sheet0.png',
	'blast-sheet1.png',
	'blast-sheet2.png',
	'run-sheet0.png',
	'run-sheet1.png',
	'tiledbackground5.png',
	'throw-sheet1.png',
	'throw-sheet0.png',
	'granade-sheet0.png',
	'protect-sheet0.png',
	'rocket-sheet0.png',
	'tiledbackground6.png',
	'tiledbackground2.png',
	'sprite13-sheet0.png',
	'spark-sheet0.png',
	'support-sheet0.png',
	'support-sheet1.png',
	'button2-sheet0.png',
	'button2-sheet1.png',
	'switch-sheet0.png',
	'gre-sheet0.png',
	'tank-sheet0.png',
	'tiledbackground7.png',
	'small-sheet0.png',
	'small-sheet1.png',
	'healthpack2-sheet0.png'
];

for (var i = 0; i < fileList.length; i++) {
	(function(fileName) {
		var options = {
			hostname: 'sda.4399.com',
			port: 80,
			path: '/4399swf/upload_swf/ftp14/ssj/20141216/h3/images/' + fileName,
			method: 'GET'
		};
		var req = http.request(options, (res) => {
			var file = fs.openSync(fileName, 'w');
			res.on('data', (chunk) => {
				console.log(chunk.length);
				fs.write(file, chunk, 0, chunk.length);
			});
			res.on('end', () => {
				fs.close(file);
			})
		});
		req.end();
	})(fileList[i]);
}