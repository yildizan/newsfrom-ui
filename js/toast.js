// Toast/Snackbar helper — replaces MatSnackBar
var Toast = {
  show: function(message, duration) {
    var el = document.getElementById('snackbar');
    document.getElementById('snackbarText').textContent = message;
    var toast = bootstrap.Toast.getOrCreateInstance(el, { delay: duration || NOTIFICATION_DURATION });
    toast.show();
  }
};
