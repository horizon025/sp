const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// POST a new post
router.post('/', async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ message: 'Error saving post', error });
  }
});

module.exports = router;
