'use strict';

var newsOutput = {};

newsOutput.apiKey = '4dd6ec97-968a-42b2-8c7f-fec423d1bcef';
newsOutput.apiUrl = 'https://webhose.io/search';

// CALL API MULTIPLE TIMES TO FILTER ARTICLES FROM THESE SPECIFIC SITES
var siteArray = ['usuncut.com', 'npr.org', 'pbs.org', 'c-span.org', 'economist.com', 'bbc.co.uk', 'salon.com', 'buzzfeed.com', 'theatlantic.com', 'theguardian.com', 'msnbc.com', 'bloomberg.com', 'newyorker.com', 'slate.com', 'huffingtonpost.com', 'therealnews.com', 'news.google.com', 'news.yahoo.com', 'wikinews.com', 'alternet.com', 'dailykos.com', 'independent.co.uk', 'time.com', 'pastemagazine.com', 'vice.com', 'currentaffairs.org', 'uk.reuters.com', 'theintercept.com'];

// MAKE ARRAY OF REPLACEMENT IMAGES
newsOutput.imageArray = ['images/bernie-sanders-portrait-01.jpg', 'images/bernie-sanders-portrait-02.jpg', 'images/bernie-sanders-portrait-03.jpg'];
// GET INFO FROM WEBHOSE NEWS API
newsOutput.getInfo = function () {
	// $.each(siteArray, function (i, site) {
	// SPECIFY QUERY
	var data = {
		token: newsOutput.apiKey,
		format: 'json',
		q: 'thread.title:(Bernie OR Sanders) site:(npr.org OR usuncut.com OR pbs.org OR c-span.org OR economist.com OR bbc.co.uk OR salon.com theatlantic.com OR buzzfeed.com OR theguardian.com OR msnbc.com OR bloomberg.com OR newyorker.com OR slate.com OR huffingtonpost.com OR therealnews.com OR news.google.com OR news.yahoo.com OR wikinews.com OR alternet.com OR dailykos.com OR independent.co.uk OR time.com OR pastemagazine.com OR vice.com OR currentaffairs.org OR uk.reuters.com OR theintercept.com)',
		site_type: 'news',
		is_first: true
	};
	$.ajax({
		url: newsOutput.apiUrl,
		method: 'GET',
		dataType: 'json',
		data: data
	}).then(function (articles) {
		var posts = articles.posts.reverse();
		// CALL displayNews FUNCTION TO SHOW RESULTS
		newsOutput.displayNews(posts);
		console.log(posts);
	});
	// });
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

//TWITTER SHARE BUTTON
!function (d, s, id) {
	var js,
	    fjs = d.getElementsByTagName(s)[0],
	    p = /^http:/.test(d.location) ? 'http' : 'https';if (!d.getElementById(id)) {
		js = d.createElement(s);js.id = id;js.src = p + '://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js, fjs);
	}
}(document, 'script', 'twitter-wjs');

//FACEBOOK SHARE BUTTON
window.fbAsyncInit = function () {
	FB.init({
		appId: '1698085880472654',
		xfbml: true,
		version: 'v2.5'
	});
};

(function (d, s, id) {
	var js,
	    fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

$(function () {
	newsOutput.init();
});