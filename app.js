require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const Post = require('./server/models/Post');
const Comment = require('./server/models/Comment');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 7200000 } // 2 hours session
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Post Routes
app.get('/posts', (req, res) => {
  Post.find().populate('comments').exec((err, posts) => {
    if (err) return res.status(500).json({ message: 'Error fetching posts' });
    res.json(posts);
  });
});

app.post('/posts', (req, res) => {
  const newPost = new Post(req.body);
  newPost.save((err, post) => {
    if (err) return res.status(500).json({ message: 'Error creating post' });
    res.json(post);
  });
});

app.delete('/posts/:postId', (req, res) => {
  Post.findByIdAndDelete(req.params.postId, (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting post' });
    res.json({ message: 'Post deleted' });
  });
});

// Comment Routes
app.post('/posts/:postId/comments', (req, res) => {
  const newComment = new Comment({ content: req.body.content, post: req.params.postId });
  newComment.save((err, comment) => {
    if (err) return res.status(500).json({ message: 'Error creating comment' });
    res.json(comment);
  });
});

app.delete('/comments/:commentId', (req, res) => {
  Comment.findByIdAndDelete(req.params.commentId, (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting comment' });
    res.json({ message: 'Comment deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});