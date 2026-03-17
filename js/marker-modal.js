// Marker modal — replaces MarkerComponent dialog
var MarkerModal = {
  open: function(news) {
    var dateStr = new Date(news.publishDate).toLocaleString('de-DE', {
      day: 'numeric', month: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });

    var thumbnailHtml = news.thumbnailUrl
      ? '<img class="thumbnail" src="' + escapeAttr(news.thumbnailUrl) + '" onerror="this.remove()">'
      : '';

    var html =
      '<div class="d-flex flex-column">' +
        thumbnailHtml +
        '<div class="text-wrapper">' +
          '<div class="header">' +
            '<div><span class="d-flex align-items-center">' +
              '<i class="fas fa-map-marker-alt fa-sm"></i>' +
              '<span class="icon-text">' + escapeHtml(news.place) + '</span>' +
            '</span></div>' +
            '<div><span class="d-flex align-items-center">' +
              '<i class="fas fa-rss fa-sm"></i>' +
              '<span class="icon-text">' + escapeHtml(news.publisherName) + '</span>' +
            '</span></div>' +
            '<div><span class="d-flex align-items-center">' +
              '<i class="fas fa-clock fa-sm"></i>' +
              '<span class="icon-text">' + escapeHtml(dateStr) + '</span>' +
            '</span></div>' +
          '</div>' +
          '<br>' +
          '<b>' + escapeHtml(news.title) + '</b>' +
          '<p>' + escapeHtml(news.description) + '</p>' +
          '<div class="footer d-flex justify-content-center align-items-center gap-2">' +
            '<button class="btn btn-sm btn-light rounded-circle share-btn" title="Link" data-news-id="' + news.id + '">' +
              '<i class="fas fa-link"></i>' +
            '</button>' +
            '<a class="btn btn-sm btn-light rounded-circle" title="Post" href="' + FACEBOOK_SHARE_URL + news.id + '" target="_blank">' +
              '<i class="fab fa-facebook-f" style="color:#3C5A99"></i>' +
            '</a>' +
            '<a class="btn btn-sm btn-light rounded-circle" title="Tweet" href="' + TWITTER_SHARE_URL + news.id + '" target="_blank">' +
              '<i class="fab fa-twitter" style="color:#1DA1F2"></i>' +
            '</a>' +
            '<a class="btn btn-sm btn-light rounded-circle" title="Go" href="' + escapeAttr(news.link) + '" target="_blank">' +
              '<i class="fas fa-external-link-alt"></i>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('markerModalContent').innerHTML = html;

    // clipboard button
    var copyBtn = document.querySelector('#markerModalContent .share-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText('https://newsfrom.news/?id=' + news.id).then(function() {
          Toast.show('✔️ Link copied to clipboard.');
        });
      });
    }

    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('markerModal'));
    modal.show();
  }
};

// HTML escaping helpers
function escapeHtml(str) {
  if (str == null) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
