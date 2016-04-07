'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var newsOutput = {};

newsOutput.apiKey = '6c929da4-9a43-4305-baee-d3f8d2717e3f';
newsOutput.apiUrl = 'https://webhose.io/search';

// CALL API MULTIPLE TIMES TO FILTER ARTICLES FROM THESE SPECIFIC SITES
var siteArray = ['usuncut.com', 'npr.org', 'pbs.org', 'c-span.org', 'economist.com', 'bbc.co.uk', 'salon.com', 'buzzfeed.com', 'theatlantic.com', 'theguardian.com', 'msnbc.com', 'bloomberg.com', 'newyorker.com', 'vox.com', 'slate.com', 'huffingtonpost.com', 'therealnews.com', 'news.google.com', 'news.yahoo.com', 'wikinews.com', 'alternet.com', 'dailykos.com', 'independent.co.uk', 'time.com', 'pastemagazine.com', 'vice.com', 'currentaffairs.org', 'uk.reuters.com', 'theintercept.com'];

//

newsOutput.imageArray = ['images/bernie-sanders-portrait-01.jpg', 'images/bernie-sanders-portrait-02.jpg', 'images/bernie-sanders-portrait-03.jpg'];
// GET INFO FROM WEBHOSE NEWS API
newsOutput.getInfo = function () {
	$.each(siteArray, function (i, site) {
		var _data;

		// SPECIFY QUERY
		var data = (_data = {
			token: newsOutput.apiKey,
			format: 'json',
			q: 'Bernie Sanders "Bernie Sanders" thread.title:(Sanders)'
		}, _defineProperty(_data, 'thread.site_full', site), _defineProperty(_data, 'site_type', 'news'), _data);
		$.ajax({
			url: newsOutput.apiUrl,
			method: 'GET',
			dataType: 'json',
			data: data
		}).then(function (articles) {
			var posts = articles.posts.reverse();
			// CALL displayNews FUNCTION TO SHOW RESULTS
			newsOutput.displayNews(posts);
		});
	});
};

// DISPLAY INFORMATION ON PAGE
newsOutput.displayNews = function (articles) {
	// WEED OUT DUPLICATE ARTICLES
	var uniqueArticles = _.uniq(articles, false, function (article) {
		return article.thread.title;
	});
	uniqueArticles = _.uniq(uniqueArticles, false, function (article) {
		return article.thread.title_full;
	});
	uniqueArticles = _.uniq(uniqueArticles, false, function (article) {
		return article.thread.uuid;
	});
	// CALL ARTICLES
	$.each(uniqueArticles, function (i, piece) {
		var date = new Date(piece.thread.published);
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var dateString = month + '/' + day + '/' + year;
		var title = $('<h1>').addClass('articleTitle').text(piece.thread.title);
		var articleLink = $('<a>').attr("href", piece.thread.url).append(title);
		var author = $('<h3>').addClass('articleAuthor').text(piece.thread.site_full);
		var sourceLink = $('<a>').attr("href", piece.thread.site_section).append(author);
		var date = $('<p>').addClass('articleDate').text(dateString);
		var imageUrl = piece.thread.main_image;
		if (!imageUrl) imageUrl = _.sample(newsOutput.imageArray);
		var image = $('<img>').attr('src', imageUrl).addClass('articleImage');
		var authorDate = $('<div>').append(sourceLink, date).addClass('authorDate');
		var contentDiv = $('<div>').append(articleLink).append(authorDate).wrap(articleLink).addClass('contentDiv');
		var article = $('<article>').append(contentDiv).append(image).addClass('grid-item');
		// ADD ARTICLE TO MASONRY AND TELL MASONRY IT'S BEEN ADDED
		newsOutput.$grid.append(article).masonry('appended', article);
	});
	$('.articleImage').error(function () {
		$(this).attr('src', _.sample(newsOutput.imageArray));
	});
	newsOutput.$grid.imagesLoaded().progress(function () {
		newsOutput.$grid.masonry('layout');
	});
};

newsOutput.init = function () {
	newsOutput.$grid = $('.grid').masonry({
		itemSelector: '.grid-item',
		columnWidth: '.grid-sizer',
		percentPosition: true
	});
	newsOutput.getInfo();
};

!function (d, s, id) {
	var js,
	    fjs = d.getElementsByTagName(s)[0],
	    p = /^http:/.test(d.location) ? 'http' : 'https';if (!d.getElementById(id)) {
		js = d.createElement(s);js.id = id;js.src = p + '://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js, fjs);
	}
}(document, 'script', 'twitter-wjs');

(function (d, s, id) {
	var js,
	    fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s);js.id = id;
	js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5";
	fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

$(function () {
	newsOutput.init();
});