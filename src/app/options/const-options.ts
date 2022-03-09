// cookie
export const NOTIFICATION_COOKIE: string = 'notification';
export const READ_NEWS_COOKIE: string = 'read-news';

// duration
export const ANIMATION_DURATION = 0.8;
export const NOTIFICATION_DURATION = 3000;

// size
export const MARKER_SIZE = 48;
export const CLUSTER_SIZE = 64;

// icon
export const READ_ICON = {
  iconUrl: 'assets/icon/inactive_marker.png',
  iconRetinaUrl: 'assets/icon/inactive_marker@2x.png', 
  iconSize: [MARKER_SIZE, MARKER_SIZE],
  iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE]
};
export const UNREAD_ICON = {
  iconUrl: 'assets/icon/marker.png',
  iconRetinaUrl: 'assets/icon/marker@2x.png', 
  iconSize: [MARKER_SIZE, MARKER_SIZE],
  iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE]
};

// share
export const FACEBOOK_SHARE_URL = 'https://www.facebook.com/sharer/sharer.php?' +
  'u=http%3A%2F%2Fnewsfrom.news%2F';
export const TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet?' +
  'hashtags=newsfrom,news&' +
  'url=http%3A%2F%2Fnewsfrom.news%2F';

// map
export const MAP_API = 'https://api.mapbox.com/styles/v1/yildizan/cjzfop7z51bop1cmvns8ekqa4/tiles/256/{z}/{x}/{y}?access_token={accessToken}';
export const DEFAULT_LATITUDE = 30.0;
export const DEFAULT_LONGITUDE = 10.0;
export const DEFAULT_ZOOM = 3;