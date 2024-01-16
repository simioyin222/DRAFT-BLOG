document.addEventListener('DOMContentLoaded', function() {
  var dateSpan = document.getElementById('post-date');
  if (dateSpan) {
      dateSpan.textContent = new Date().toLocaleDateString();
  }
});