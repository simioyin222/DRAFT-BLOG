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
// Add here the routes for creating, reading, updating, and deleting blog posts
// (The code provided in the previous response)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});