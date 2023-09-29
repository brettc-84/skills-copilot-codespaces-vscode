// Create web server

// Import express
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// Import models
const {BlogPosts} = require('./models');

// Add blog posts
BlogPosts.create('First Post', 'This is my first blog post', 'John Doe');
BlogPosts.create('Second Post', 'This is my second blog post', 'Jane Doe');

// GET requests
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

// POST requests
router.post('/', jsonParser, (req, res) => {
    // Check for required fields
    const requiredFields = ['title', 'content', 'author'];
    for(let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    // Create new blog post
    const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(post);
});

// PUT requests
router.put('/:id', jsonParser, (req, res) => {
    // Check for required fields
    const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
    for(let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    // Check if id in request body matches id in request params
    if(req.params.id !== req.body.id) {
        const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
        console.error(message);
        return res.status(400).send(message);
    }

    // Update blog post
    console.log(`Updating blog post ${req.params.id}`);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,