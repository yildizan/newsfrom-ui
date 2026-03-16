// Filter modal — replaces FilterComponent dialog
var FilterModal = {
  _onSubmit: null,

  open: function(categories, publishers, keywords, onSubmit) {
    FilterModal._onSubmit = onSubmit;

    var html =
      '<div class="modal-header">' +
        '<h5 class="modal-title">Search</h5>' +
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body">' +
        // Keywords chip input
        '<label class="form-label"><i class="fas fa-key fa-sm"></i> <b class="icon-text">Keywords</b></label>' +
        '<div class="chip-container border rounded p-2 mb-3 d-flex flex-wrap gap-1 align-items-center">' +
          FilterModal._renderChips(keywords) +
          '<input type="text" class="chip-input border-0 flex-grow-1" id="keywordInput" placeholder="Type and press Enter">' +
        '</div>' +
        // Categories multi-checkbox
        '<label class="form-label"><i class="fas fa-list fa-sm"></i> <b class="icon-text">Categories</b></label>' +
        '<div class="border rounded p-2 mb-3" style="max-height:150px;overflow-y:auto">' +
          FilterModal._renderCheckboxes(categories, 'cat') +
        '</div>' +
        // Publishers multi-checkbox
        '<label class="form-label"><i class="fas fa-rss fa-sm"></i> <b class="icon-text">Publishers</b></label>' +
        '<div class="border rounded p-2 mb-3" style="max-height:150px;overflow-y:auto">' +
          FilterModal._renderCheckboxes(publishers, 'pub') +
        '</div>' +
      '</div>' +
      '<div class="modal-footer justify-content-center">' +
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>' +
        '<button type="button" class="btn btn-danger" id="filterResetBtn">Reset</button>' +
        '<button type="button" class="btn btn-primary" id="filterSubmitBtn">Submit</button>' +
      '</div>';

    document.getElementById('filterModalContent').innerHTML = html;

    // bind keyword input events
    var input = document.getElementById('keywordInput');
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        FilterModal._addKeyword(input);
      }
    });
    input.addEventListener('blur', function() {
      FilterModal._addKeyword(input);
    });

    // bind chip remove buttons
    FilterModal._bindChipRemoves();

    // reset
    document.getElementById('filterResetBtn').addEventListener('click', function() {
      // check all checkboxes
      document.querySelectorAll('#filterModalContent input[type="checkbox"]').forEach(function(cb) {
        cb.checked = true;
      });
      // clear keywords
      document.querySelectorAll('#filterModalContent .keyword-chip').forEach(function(chip) {
        chip.remove();
      });
    });

    // submit
    document.getElementById('filterSubmitBtn').addEventListener('click', function() {
      var selectedCats = [];
      document.querySelectorAll('#filterModalContent input[data-group="cat"]:checked').forEach(function(cb) {
        var cat = categories.find(function(c) { return c.id == cb.value; });
        if (cat) selectedCats.push(cat);
      });

      var selectedPubs = [];
      document.querySelectorAll('#filterModalContent input[data-group="pub"]:checked').forEach(function(cb) {
        var pub = publishers.find(function(p) { return p.id == cb.value; });
        if (pub) selectedPubs.push(pub);
      });

      var kws = [];
      document.querySelectorAll('#filterModalContent .keyword-chip').forEach(function(chip) {
        kws.push(chip.getAttribute('data-keyword'));
      });

      bootstrap.Modal.getInstance(document.getElementById('filterModal')).hide();

      if (FilterModal._onSubmit) {
        FilterModal._onSubmit({ categories: selectedCats, publishers: selectedPubs, keywords: kws });
      }
    });

    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('filterModal'));
    modal.show();
  },

  _renderChips: function(keywords) {
    var html = '';
    keywords.forEach(function(kw) {
      html += '<span class="badge bg-secondary keyword-chip d-inline-flex align-items-center gap-1" data-keyword="' + escapeAttr(kw) + '">' +
        escapeHtml(kw) +
        '<a href="#" class="text-white chip-remove"><i class="fas fa-times fa-xs"></i></a>' +
      '</span>';
    });
    return html;
  },

  _renderCheckboxes: function(items, group) {
    var html = '';
    items.forEach(function(item) {
      var checked = item.visible ? ' checked' : '';
      var icon = item.icon ? '<i class="' + escapeAttr(item.icon) + '"></i> ' : '';
      html += '<div class="form-check">' +
        '<input class="form-check-input" type="checkbox" value="' + item.id + '" id="' + group + item.id + '" data-group="' + group + '"' + checked + '>' +
        '<label class="form-check-label" for="' + group + item.id + '">' + icon + escapeHtml(item.name) + '</label>' +
      '</div>';
    });
    return html;
  },

  _addKeyword: function(input) {
    var value = input.value.replace(/,/g, '').trim().toLowerCase();
    if (value.length > 0) {
      var chipHtml = '<span class="badge bg-secondary keyword-chip d-inline-flex align-items-center gap-1" data-keyword="' + escapeAttr(value) + '">' +
        escapeHtml(value) +
        '<a href="#" class="text-white chip-remove"><i class="fas fa-times fa-xs"></i></a>' +
      '</span>';
      input.insertAdjacentHTML('beforebegin', chipHtml);
      input.value = '';
      FilterModal._bindChipRemoves();
    }
  },

  _bindChipRemoves: function() {
    document.querySelectorAll('#filterModalContent .chip-remove').forEach(function(btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        btn.closest('.keyword-chip').remove();
      };
    });
  }
};
