// Constants — direct port from const-options.ts and map-options.ts

// cookie names
var NOTIFICATION_COOKIE = 'notification';
var READ_NEWS_COOKIE = 'read-news';

// duration
var ANIMATION_DURATION = 0.8;
var NOTIFICATION_DURATION = 3000;

// marker/cluster sizes
var MARKER_SIZE = 48;
var CLUSTER_SIZE = 64;

// marker icons
var READ_ICON = {
  iconUrl: 'assets/icon/inactive_marker.png',
  iconRetinaUrl: 'assets/icon/inactive_marker@2x.png',
  iconSize: [MARKER_SIZE, MARKER_SIZE],
  iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE]
};
var UNREAD_ICON = {
  iconUrl: 'assets/icon/marker.png',
  iconRetinaUrl: 'assets/icon/marker@2x.png',
  iconSize: [MARKER_SIZE, MARKER_SIZE],
  iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE]
};

// share URLs
var FACEBOOK_SHARE_URL = 'https://www.facebook.com/sharer/sharer.php?' +
  'u=https%3A%2F%2Fnewsfrom.news%2F%3Fid%3D';
var TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet?' +
  'hashtags=newsfrom,news&' +
  'url=https%3A%2F%2Fnewsfrom.news%2F%3Fid%3D';

// map tile API
var MAP_API = Config.apiUrl + '/map/tile/{z}/{x}/{y}';
var DEFAULT_LATITUDE = 30.0;
var DEFAULT_LONGITUDE = 10.0;
var DEFAULT_ZOOM = 4;

// map tile options
var MAP_OPTIONS = {
  attribution: '<a href="https://www.mapbox.com/">Mapbox</a>' +
    ' | <a href="assets/static/terms.html" target="_blank">Terms &amp; Conditions</a>' +
    ' | <a href="assets/static/privacy.html" target="_blank">Privacy Policy</a>',
  maxZoom: 9,
  minZoom: 4,
  noWrap: true,
  detectRetina: true,
  bounds: [[-180, -180], [180, 180]]
};

// cluster tier logic
function defineCluster(count) {
  if (count < 10) return 1;
  else if (count < 50) return 2;
  else if (count < 100) return 3;
  else if (count < 250) return 4;
  else return 5;
}
