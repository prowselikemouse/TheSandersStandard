var newsOutput = {};

newsOutput.apiKey = '6c929da4-9a43-4305-baee-d3f8d2717e3f';
newsOutput.apiUrl = 'https://webhose.io/search';

//array of all sites

var siteArray = ['huffingtonpost.com', 'nytimes.com', 'npr.org', 'c-span.org', 'economist.com', 'wsj.com', 'bbc.co.uk', 'salon.com', 'buzzfeed.com', 'theatlantic.com', 'theguardian.com', 'washingtonpost.com', 'msnbc.com', 'bloomberg.com', 'newyorker.com', 'vox.com', 'slate.com', 'reuters.com', 'therealnews.com', 'news.google.com', 'news.yahoo.com', 'wikinews.com', 'alternet.com', 'dailykos.com', 'independent.co.uk', 'time.com'];
// get information from news API
newsOutput.getInfo = function() {
	$.each(siteArray, function(i, site) {
		$.ajax ({
			url: newsOutput.apiUrl,
			method: 'GET',
			dataType: 'json',
			data: {
				token: newsOutput.apiKey,
				format: 'json',
				q: 'Bernie Sanders "Bernie Sanders" thread.title:(Bernie Sanders)',
				site: site
			}
		}).then(function(articles) {
			console.log(articles);
			var posts = articles.posts.reverse();
			// call the displayNews function to display news
			newsOutput.displayNews(posts);
		});
	});
}
// newsOutput.getInfo = function() {
// 	$.ajax ({
// 		url: newsOutput.apiUrl,
// 		method: 'GET',
// 		dataType: 'json',
// 		data: {
// 			token: newsOutput.apiKey,
// 			format: 'json',
// 			q: 'Bernie Sanders "Bernie Sanders" thread.title:(Bernie Sanders)',
// 			site: siteName
// 		}
// 	}).then(function(articles) {
// 		console.log(articles);
// 		// call the displayNews function to display news
// 		newsOutput.displayNews(articles);
// 	})
// };

// with that information, display it on the page
newsOutput.displayNews = function(articles) {
	// make sure there are no duplicate articles
	var uniqueArticles = _.uniq(articles, false, function(article) {
          return article.thread.title;
        });
	uniqueArticles = _.uniq(uniqueArticles, false, function(article) {
          return article.thread.title_full;
        });
	uniqueArticles = _.uniq(uniqueArticles, false, function(article) {
          return article.thread.uuid;
        });
	console.log(uniqueArticles);
	// filter articles from certain sites
	// var sitesToPullFrom = uniqueArticles.filter(function(val) {
	// 	var safeSites = val.thread.site;
	// 	if (safeSites == 'nytimes.com' ||
	// 		safeSites == 'npr.org' ||
	// 		safeSites == 'c-span.org' ||
	// 		safeSites == 'economist.com' ||
	// 		safeSites == 'wsj.com' ||
	// 		safeSites == 'bbc.co.uk' ||
	// 		safeSites == 'salon.com' ||
	// 		safeSites == 'buzzfeed.com' ||
	// 		safeSites == 'theatlantic.com' ||
	// 		safeSites == 'huffingtonpost.com' ||
	// 		safeSites == 'theguardian.com' ||
	// 		safeSites == 'washingtonpost.com' ||
	// 		safeSites == 'msnbc.com' ||
	// 		safeSites == 'bloomberg.com' ||
	// 		safeSites == 'newyorker.com' ||
	// 		safeSites == 'vox.com' ||
	// 		safeSites == 'slate.com' ||
	// 		safeSites == 'reuters.com' ||
	// 		safeSites == 'therealnews.com' ||
	// 		safeSites == 'news.google.com' ||
	// 		safeSites == 'news.yahoo.com' ||
	// 		safeSites == 'wikinews.com' ||
	// 		safeSites == 'alternet.com' ||
	// 		safeSites == 'dailykos.com' ||
	// 		safeSites == 'independent.co.uk' ||
	// 		safeSites == 'time.com'
	// 		) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// 	console.log(safeSites);
	// })
	// console.log(sitesToPullFrom);

	// call the articles!
	$.each(uniqueArticles, function(i, piece) {
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
		var contentDiv = $('<div>').append(title, author, date).addClass('contentDiv');
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
}




newsOutput.init = function() {
	newsOutput.getInfo();
	// newsOutput.displayNews();
};

$(function(){
	newsOutput.init();
});

