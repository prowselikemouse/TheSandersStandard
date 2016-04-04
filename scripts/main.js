'use strict';

var newsOutput = {};

newsOutput.apiKey = '6c929da4-9a43-4305-baee-d3f8d2717e3f';
newsOutput.apiUrl = 'https://webhose.io/search';

// call api multiple times in order to filter articles from these specific sites
var siteArray = ['theintercept.com'];

// 'huffingtonpost.com', 'usuncut.com', 'npr.org', 'pbs.org', 'c-span.org', 'economist.com', 'bbc.co.uk', 'salon.com', 'buzzfeed.com', 'theatlantic.com', 'theguardian.com', 'msnbc.com', 'bloomberg.com', 'newyorker.com', 'vox.com', 'slate.com', 'reuters.com', 'therealnews.com', 'news.google.com', 'news.yahoo.com', 'wikinews.com', 'alternet.com', 'dailykos.com', 'independent.co.uk', 'time.com', 'pastemagazine.com', 'vice.com', 'currentaffairs.org', 

//bring in only articles from news sites, NO blog posts!

//bring in articles from the 
// get information from news API
newsOutput.getInfo = function () {
	$.each(siteArray, function (i, site) {
		$.ajax({
			url: newsOutput.apiUrl,
			method: 'GET',
			dataType: 'json',
			data: {
				token: newsOutput.apiKey,
				format: 'json',
				q: 'Bernie Sanders "Bernie Sanders" thread.title:(Sanders)',
				site: site
			}
		}).then(function (articles) {
			console.log(articles);
			var posts = articles.posts.reverse();
			// call the displayNews function to display news
			newsOutput.displayNews(posts);
		});
	});
};



// with that information, display it on the page
newsOutput.displayNews = function (articles) {
	// make sure there are no duplicate articles
	var uniqueArticles = _.uniq(articles, false, function (article) {
		return article.thread.title;
	});
	uniqueArticles = _.uniq(uniqueArticles, false, function (article) {
		return article.thread.title_full;
	});
	uniqueArticles = _.uniq(uniqueArticles, false, function (article) {
		return article.thread.uuid;
	});
	console.log(uniqueArticles);
	// call the articles!
	$.each(uniqueArticles, function (i, piece) {
		// console.log(piece);
		var date = new Date(piece.thread.published);
		console.log(date);
		var day = date.getDate();
		console.log(day);
		var month = date.getMonth() + 1;
		console.log(month);
		var year = date.getFullYear();
		console.log(year);
		var dateString = month + '/' + day + '/' + year;
		var title = $('<h1>').addClass('articleTitle').text(piece.thread.title);
		var author = $('<h3>').addClass('articleAuthor').text(piece.thread.site_full);
		var date = $('<p>').addClass('articleDate').text(dateString);
		// var imageUrl = $('<img>').attr('src', piece.thread.main_image);
		// imageUrl.error(function () {
		// 	$(this).attr('src', 'bernie-sanders-portrait-01.jpg')
		// })
		// if (piece.thread.main_image == null) {
		// 	$(imageUrl).attr('src', 'bernie-sanders-portrait-01.jpg')
		// }
		// var imageDiv = $('<div>').append(imageUrl).addClass('imgContainer');
		var imageUrl = piece.thread.main_image;
		var imageTest = $('<img>').attr('src', piece.thread.main_image);
		imageTest.error(function () {
			$(article).css('background-image', 'url(' + 'images/bernie-sanders-portrait-01.jpg' + ')');
		});
		// var imageDiv = $('<div>').append(imageUrl).addClass('imgContainer');
		var authorDate = $('<div>').append(author, date).addClass('authorDate');
		var contentDiv = $('<div>').append(title, authorDate).addClass('contentDiv');
		// if (imageUrl)
		var articleLink = $('<a>').attr("href", piece.thread.url).addClass('grid-item');
		var article = $('<article>').append(contentDiv).wrap(articleLink).parent().addClass('grid-item').appendTo('#results');
		if (piece.thread.main_image == null) {
			$(article).css('background-image', 'url(' + 'images/bernie-sanders-portrait-01.jpg' + ')');
		} else {
			$(article).css('background-image', 'url(' + imageUrl + ')');
		}

		//
		// background image being called is the last in the images of the array that is produced
		// $('#results').append(article);
	});
	// call masonry here
	// $('.grid').masonry({
	//   itemSelector: '.grid-item',
	//   columnWidth: '.grid-item',
	// });
};

newsOutput.init = function () {
	newsOutput.getInfo();
	// newsOutput.displayNews();
};

$(function () {
	newsOutput.init();
});