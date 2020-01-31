import { Location } from '../model/location';

// cookie
export const COOKIE_SEPARATOR: string = ';';
export const CATEGORY_COOKIE: string = 'categories';
export const PUBLISHER_COOKIE: string = 'publishers';
export const LOCATION_COOKIE: string = 'location';
export const ZOOM_COOKIE: string = 'zoom';
export const NOTIFICATION_COOKIE: string = 'notification';
export const VERSION_COOKIE: string = 'version';
export const READ_COOKIE: string = 'read';

// location
export const DEFAULT_LOCATION: Location = {
  // Turkey
  id: 219,
  latitude: 39.91987000,
  longitude: 32.85427000
};
export const DEFAULT_ZOOM = 2;

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

// api
export const MAP_API = 'https://api.mapbox.com/styles/v1/yildizan/cjzfop7z51bop1cmvns8ekqa4/tiles/256/{z}/{x}/{y}?access_token={accessToken}';