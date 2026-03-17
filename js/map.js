// Main map module — replaces MapComponent
var NewsMap = {
  map: null,
  cluster: null,
  markers: [],

  feeds: [],
  categories: new Map(),
  publishers: new Map(),
  newsList: [],

  readIds: new Set(),
  keywords: [],

  init: function() {
    NewsMap.initMap();
    NewsMap.loadFeeds();
    NewsMap.checkRoute();
    NewsMap.showCookieNotification();

    window.addEventListener('beforeunload', function() {
      NewsMap.saveReadNews();
    });
  },

  initMap: function() {
    NewsMap.map = L.map('map', {
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0
    });
    L.tileLayer(MAP_API, MAP_OPTIONS).addTo(NewsMap.map);
    L.easyButton('<i class="fas fa-filter"></i>', function() { NewsMap.openFilter(); }).addTo(NewsMap.map);
    L.easyButton('<i class="fas fa-info"></i>', function() { NewsMap.openInfo(); }).addTo(NewsMap.map);
    NewsMap.map.setView([DEFAULT_LATITUDE, DEFAULT_LONGITUDE], DEFAULT_ZOOM);
  },

  loadFeeds: function() {
     Api.fetchFeeds().then(function(feeds) {
        NewsMap.feeds = feeds;
        NewsMap.processFeedData(feeds);
    });
  },

  processFeedData: function(feeds) {
    for (var i = 0; i < feeds.length; i++) {
      var feed = feeds[i];
      NewsMap.categories.set(feed.category.id, {
        id: feed.category.id,
        name: feed.category.name,
        icon: feed.category.icon,
        background: feed.category.background,
        displayOrder: feed.category.displayOrder,
        visible: true,
        newsList: []
      });
      NewsMap.publishers.set(feed.publisher.id, {
        id: feed.publisher.id,
        name: feed.publisher.name,
        visible: true
      });
    }

    NewsMap.recoverReadNews();
    NewsMap.initNews(feeds);
  },

  recoverReadNews: function() {
    var readNewsCookie = CookieUtil.get(READ_NEWS_COOKIE);
    if (readNewsCookie) {
      try {
        var readIds = JSON.parse(readNewsCookie);
        NewsMap.readIds = new Set(readIds);
      } catch (err) {
        // ignore invalid cookie
      }
    }
  },

  initNews: function(feeds) {
    NewsMap.newsList = [];
    for (var i = 0; i < feeds.length; i++) {
      var feed = feeds[i];
      for (var j = 0; j < feed.newsList.length; j++) {
        var news = feed.newsList[j];
        news.categoryId = feed.category.id;
        news.publisherName = feed.publisher.name;
        news.index = NewsMap.newsList.length;
        news.isRead = NewsMap.readIds.has(news.id);
        NewsMap.newsList.push(news);
      }
    }

    NewsMap.initMarkers();
    NewsMap.initCluster();
  },

  initMarkers: function() {
    NewsMap.markers = [];
    var unreadIcon = L.icon(UNREAD_ICON);
    var readIcon = L.icon(READ_ICON);

    for (var i = 0; i < NewsMap.newsList.length; i++) {
      var news = NewsMap.newsList[i];
      NewsMap.markers.push(
        L.marker(
          [news.latitude, news.longitude],
          { icon: news.isRead ? readIcon : unreadIcon, index: news.index }
        ).on('click', function(e) { NewsMap.onMarkerClick(e); })
      );
    }
  },

  initCluster: function() {
    if (NewsMap.cluster == null) {
      NewsMap.cluster = new L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
          var count = cluster.getChildCount();
          var tier = defineCluster(count);
          var html = '<span class="cluster-badge cluster-badge-' + tier + '" data-count="' + count + '"></span>';
          return new L.DivIcon({
            html: html,
            className: 'cluster-icon',
            iconSize: new L.point(CLUSTER_SIZE, CLUSTER_SIZE),
            iconAnchor: [CLUSTER_SIZE / 2, CLUSTER_SIZE]
          });
        }
      });
      NewsMap.cluster.on('clusterclick', function(e) { NewsMap.onClusterClick(e); });
      NewsMap.map.addLayer(NewsMap.cluster);
    } else {
      NewsMap.cluster.clearLayers();
    }

    NewsMap.cluster.addLayers(NewsMap.markers);
  },

  onMarkerClick: function(e) {
    var news = NewsMap.newsList[e.target.options.index];

    MarkerModal.open(news);
    NewsMap.map.panTo(L.latLng(news.latitude, news.longitude), { duration: ANIMATION_DURATION });

    if (!news.isRead) {
      e.target.setIcon(L.icon(READ_ICON));
      news.isRead = true;
    }
  },

  onClusterClick: function(e) {
    var categoryMap = new Map();
    var childMarkers = e.layer.getAllChildMarkers();
    var lastNews = null;

    for (var i = 0; i < childMarkers.length; i++) {
      var news = NewsMap.newsList[childMarkers[i].options.index];
      lastNews = news;
      var category = categoryMap.get(news.categoryId);

      if (category == null) {
        var orig = NewsMap.categories.get(news.categoryId);
        categoryMap.set(news.categoryId, {
          id: orig.id,
          name: orig.name,
          icon: orig.icon,
          background: orig.background,
          displayOrder: orig.displayOrder,
          newsList: []
        });
        category = categoryMap.get(news.categoryId);
      }
      category.newsList.push(news);
    }

    var categories = Array.from(categoryMap.values());
    ClusterModal.open(categories);

    if (lastNews) {
      NewsMap.map.panTo(L.latLng(lastNews.latitude, lastNews.longitude), { duration: ANIMATION_DURATION });
    }
  },

  openFilter: function() {
    var categories = Array.from(NewsMap.categories.values());
    var publishers = Array.from(NewsMap.publishers.values());

    FilterModal.open(categories, publishers, NewsMap.keywords.slice(), function(result) {
      // sync category visibility
      NewsMap.categories.forEach(function(cat) { cat.visible = false; });
      result.categories.forEach(function(cat) {
        var entry = NewsMap.categories.get(cat.id);
        if (entry) entry.visible = true;
      });

      // sync publisher visibility
      NewsMap.publishers.forEach(function(pub) { pub.visible = false; });
      result.publishers.forEach(function(pub) {
        var entry = NewsMap.publishers.get(pub.id);
        if (entry) entry.visible = true;
      });

      NewsMap.keywords = result.keywords;
      NewsMap.applyFilters();
    });
  },

  applyFilters: function() {
    var feeds = NewsMap.feeds.filter(function(f) {
      var catVisible = NewsMap.categories.get(f.category.id).visible;
      var pubVisible = NewsMap.publishers.get(f.publisher.id).visible;
      return catVisible && pubVisible;
    });

    // If keywords are set, filter each feed's newsList
    if (NewsMap.keywords.length > 0) {
      feeds = feeds.map(function(f) {
        var filtered = f.newsList.filter(function(news) {
          var title = (news.title || '').toLowerCase();
          var desc = (news.description || '').toLowerCase();
          return NewsMap.keywords.some(function(kw) {
            return title.indexOf(kw) !== -1 || desc.indexOf(kw) !== -1;
          });
        });
        return { category: f.category, publisher: f.publisher, newsList: filtered };
      }).filter(function(f) { return f.newsList.length > 0; });
    }

    NewsMap.initNews(feeds);
  },

  openInfo: function() {
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('infoModal'));
    modal.show();
  },

  showCookieNotification: function() {
    if (!CookieUtil.check(NOTIFICATION_COOKIE)) {
      var toastEl = document.getElementById('cookieToast');
      var toast = bootstrap.Toast.getOrCreateInstance(toastEl);
      toast.show();

      document.getElementById('cookieAcceptBtn').addEventListener('click', function() {
        toast.hide();
        CookieUtil.set(NOTIFICATION_COOKIE, 'notified');
      });
    }
  },

  saveReadNews: function() {
    var readNews = NewsMap.newsList.filter(function(n) { return n.isRead; });
    if (readNews.length > 0) {
      CookieUtil.set(READ_NEWS_COOKIE, JSON.stringify(readNews.map(function(r) { return r.id; })));
    }
  },

  checkRoute: function() {
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));
    if (id) {
      Api.getNews(id).then(function(news) {
        if (news == null) { Toast.show('❌ This news is out of date.'); return; }
        news.publisherName = news.publisher.name;
        MarkerModal.open(news);
        NewsMap.map.panTo(L.latLng(news.latitude, news.longitude), { duration: ANIMATION_DURATION });
      });
    }
  }
};

// Boot
document.addEventListener('DOMContentLoaded', function() {
  NewsMap.init();
});
