document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('post-form');
  form.onsubmit = function(event) {
      event.preventDefault();
      createPost();
  };
});