// Cookie helper — replaces ngx-cookie-service
var CookieUtil = {
  get: function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
  },
  set: function(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; SameSite=Lax';
  },
  check: function(name) {
    return CookieUtil.get(name) !== '';
  }
};
