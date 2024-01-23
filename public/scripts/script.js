document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const postForm = document.getElementById('post-form');
    const registrationForm = document.getElementById('registration-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        loginUser();
    });

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        registerUser();
    });

    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        createPost();
    });

    loadPosts();
});

function loginUser() {
    // ... existing login function code ...
}

function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Registration failed.');
    })
    .then(data => {
        console.log(data);
        alert('Registration successful! You can now log in.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

function createPost() {
    // ... existing createPost function code ...
}

function loadPosts() {
    // ... existing loadPosts function code ...
}