// Cluster modal — replaces ClusterComponent dialog
var ClusterModal = {
  open: function(categories) {
    categories.sort(function(a, b) { return a.displayOrder > b.displayOrder ? 1 : -1; });

    var html = '<div class="accordion" id="clusterAccordion">';

    categories.forEach(function(category, ci) {
      var catId = 'clusterCat' + ci;
      var bgStyle = 'background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 65%, rgba(255,255,255,0) 100%), url(' + escapeAttr(category.background) + '); background-size: cover;';

      html += '<div class="accordion-item category-wrapper">' +
        '<h2 class="accordion-header">' +
          '<button class="accordion-button collapsed category-header" type="button" ' +
            'data-bs-toggle="collapse" data-bs-target="#' + catId + '" style="' + bgStyle + '">' +
            '<span class="d-flex align-items-center gap-1">' +
              '<i class="' + escapeAttr(category.icon) + '"></i>' +
              '<b>' + escapeHtml(category.name) + '</b>' +
            '</span>' +
          '</button>' +
        '</h2>' +
        '<div id="' + catId + '" class="accordion-collapse collapse" data-bs-parent="#clusterAccordion">' +
          '<div class="accordion-body p-1">' +
            '<div class="accordion category-content" id="' + catId + 'News">';

      category.newsList.forEach(function(news, ni) {
        var newsId = catId + 'News' + ni;
        var dateStr = new Date(news.publishDate).toLocaleString('de-DE', {
          day: 'numeric', month: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
        });
        var readClass = news.isRead ? ' read-title' : '';
        var thumbnailHtml = news.thumbnailUrl
          ? '<img class="thumbnail" src="' + escapeAttr(news.thumbnailUrl) + '" style="width:100%;height:10vh;object-fit:cover" onerror="this.outerHTML=\'<div class=&quot;d-flex align-items-center justify-content-center text-muted&quot; style=&quot;width:100%;height:10vh;background:#e9ecef&quot;><i class=&quot;fas fa-image&quot;></i></div>\'">'
          : '<div class="d-flex align-items-center justify-content-center text-muted" style="width:100%;height:10vh;background:#e9ecef"><i class="fas fa-image"></i></div>';

        html += '<div class="accordion-item">' +
          '<h2 class="accordion-header">' +
            '<button class="accordion-button collapsed p-1" type="button" ' +
              'data-bs-toggle="collapse" data-bs-target="#' + newsId + '" data-news-index="' + news.index + '">' +
              '<div class="d-flex w-100 align-items-center">' +
                '<div style="flex:0 0 20%">' +
                  thumbnailHtml +
                '</div>' +
                '<div class="text-wrapper" style="flex:0 0 80%;padding-left:0.5vw">' +
                  '<b class="' + readClass + '">' + escapeHtml(news.title) + '</b>' +
                '</div>' +
              '</div>' +
            '</button>' +
          '</h2>' +
          '<div id="' + newsId + '" class="accordion-collapse collapse" data-bs-parent="#' + catId + 'News">' +
            '<div class="accordion-body">' +
              '<div class="header">' +
                '<span class="d-inline-block me-2"><i class="fas fa-map-marker-alt fa-sm"></i> <span class="icon-text">' + escapeHtml(news.place) + '</span></span>' +
                '<span class="d-inline-block me-2"><i class="fas fa-rss fa-sm"></i> <span class="icon-text">' + escapeHtml(news.publisherName) + '</span></span>' +
                '<span class="d-inline-block"><i class="fas fa-clock fa-sm"></i> <span class="icon-text">' + escapeHtml(dateStr) + '</span></span>' +
              '</div>' +
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
          '</div>' +
        '</div>';
      });

      html += '</div></div></div></div>';
    });

    html += '</div>';

    var container = document.getElementById('clusterModalContent');
    container.innerHTML = html;

    // mark as read on expand
    container.querySelectorAll('.accordion-button[data-news-index]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(btn.getAttribute('data-news-index'));
        if (typeof NewsMap !== 'undefined' && NewsMap.newsList[idx]) {
          NewsMap.newsList[idx].isRead = true;
          btn.querySelector('b').classList.add('read-title');
        }
      });
    });

    // clipboard buttons
    container.querySelectorAll('.share-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-news-id');
        navigator.clipboard.writeText('https://newsfrom.news/?id=' + id).then(function() {
          Toast.show('✔️ Link copied to clipboard.');
        });
      });
    });

    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('clusterModal'));
    modal.show();
  }
};
