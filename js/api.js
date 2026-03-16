// API service — replaces FeedService, NewsService, LocationService
var Api = {
  fetchFeeds: function() {
    return fetch(Config.apiUrl + '/feed').then(function(r) { return r.json(); });
  },
  getNews: function(id) {
    return fetch(Config.apiUrl + '/news/' + encodeURIComponent(id)).then(function(r) { return r.json(); });
  },
};
