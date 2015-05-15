var express = require('express'),
	superagent = require('superagent'),
	cheerio = require('cheerio');

var app = express();
	targetPort = process.env.PORT || 3000;

app.get('/', function (req, res, next) {
	superagent.get('https://cnodejs.org').end(function (err, sres) {
		var $, items = [];
		if (err) {
			return next(err);
		}
		$ = cheerio.load(sres.text);
		$('#topic_list .cell').each(function (idx, elem) {
			var $elem = $(elem);
			var $title = $elem.find('.topic_title');
			items.push({
				title: $title.attr('title'),
				href: $title.attr('href'),
				author: $elem.find('.user_avatar img').attr('title')
			});
		});
		
		res
			.status(200)
			.set({
			  'Content-Type': 'application/json'
			})
			.send(items);
	});
});

app.listen(targetPort, function (req, res) {
	console.log('app is running at port ' + targetPort + '.');
});
