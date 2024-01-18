require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./server/models/User'); // Adjust path as necessary
const Post = require('./server/models/Post'); // Adjust path as necessary

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'secret', // Replace with your secret in production
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }).then(user => {
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // Passwords match
        return done(null, user);
      } else {
        // Passwords do not match
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  }).catch(err => done(err));
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

// User Registration Route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;
    new User({ username, password: hashedPassword }).save()
      .then(user => res.redirect('/')) // Redirect to homepage after registration
      .catch(err => console.log(err));
  });
});

// User Login Route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}));

// User Logout Route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Blog Post Routes
// POST route to create a new blog post
app.post('/posts', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User not authenticated');
  }
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id 
  });
  newPost.save()
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to retrieve all blog posts
app.get('/posts', (req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

// PUT route to update a specific blog post
app.put('/posts/:postId', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User not authenticated');
  }
  Post.findById(req.params.postId)
    .then(post => {
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).send('Not authorized to edit this post');
      }
      post.title = req.body.title;
      post.content = req.body.content;
      post.save()
        .then(() => res.json('Post updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE route to delete a specific blog post
app.delete('/posts/:postId', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User not authenticated');
  }
  Post.findByIdAndDelete(req.params.postId)
    .then(() => res.json('Post deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});