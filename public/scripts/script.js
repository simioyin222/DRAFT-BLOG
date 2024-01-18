document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const postForm = document.getElementById('post-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        loginUser();
    });

    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        createPost();
    });

    loadPosts();
});

function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function createPost() {
    const content = document.getElementById('new-post-content').value.trim();

    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadPosts(); // Reload posts after creation
    })
    .catch(error => console.error('Error:', error));
}
