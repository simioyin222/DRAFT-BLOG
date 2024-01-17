const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path as necessary

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('your-mongodb-connection-string', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: 'secret', // Replace with your secret in production
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Incorrect username.' }); }

    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // Passwords match
        return done(null, user);
      } else {
        // Passwords do not match
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

// Serialize and deserialize user instances to and from the session.
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
      .then(user => res.redirect('/login'))
      .catch(err => console.log(err));
  });
});

// User Login Route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false // Set to true if using flash messages
}));

// User Logout Route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
