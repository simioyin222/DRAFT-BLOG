document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('post-form');
  form.onsubmit = function(event) {
      event.preventDefault();
      createPost();
  };
});

function createPost() {
  var username = document.getElementById('username').value.trim();
  var content = document.getElementById('new-post-content').value.trim();
  if (username && content) {
      var postSection = document.createElement('section');
      var currentDate = new Date().toLocaleDateString();
      postSection.innerHTML = `
          <article>
              <header>
                  <h3>Posted by ${username} on ${currentDate}</h3>
              </header>
              <p>${content}</p>
          </article>
      `;
      var mainContent = document.querySelector('main');
      mainContent.insertBefore(postSection, mainContent.firstChild.nextSibling);
      document.getElementById('username').value = '';
      document.getElementById('new-post-content').value = '';
  }
}