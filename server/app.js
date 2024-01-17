require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware for parsing JSON and urlencoded data and for sessions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your session secret', // Replace with a real secret in production
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and use it with sessions
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static('../public'));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Listen on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});