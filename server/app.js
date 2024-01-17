require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Update 
const Post = require('./models/Post'); // Update 
const Comment = require('./models/Comment'); // Update 
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your session secret', // Replace with your code
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
// ... Passport Local Strategy and Serialization/Deserialization ...

// Ensure user is authenticated middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Not authenticated' });
}

// Routes for Blog Posts
// ... Existing routes for creating and viewing blog posts ...

// API Endpoint: Edit a blog post
app.put('/api/posts/:id', isAuthenticated, (req, res) => {
    const { title, content } = req.body;
    Post.findOneAndUpdate({ _id: req.params.id, author: req.user._id }, { title, content }, { new: true })
        .then(post => {
            if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
            res.json(post);
        })
        .catch(err => res.status(500).json({ message: 'Error updating post' }));
});

// API Endpoint: Delete a blog post
app.delete('/api/posts/:id', isAuthenticated, (req, res) => {
    Post.findOneAndDelete({ _id: req.params.id, author: req.user._id })
        .then(post => {
            if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
            res.json({ message: 'Post deleted successfully' });
        })
        .catch(err => res.status(500).json({ message: 'Error deleting post' }));
});

// Routes for Comments
// ... Implement routes for adding, editing, and deleting comments ...

app.use(express.static('../public'));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
