const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const blogController = require('../controllers/blogController');

// Get all public blogs
router.get('/public', blogController.getAllBlogs);

// Protected routes (require authentication)
router.use(verifyToken);

// Get user's blogs
router.get('/my-blogs', blogController.getUserBlogs);

// Create a new blog
router.post('/', blogController.createBlog);

// Update a blog
router.put('/:id', blogController.updateBlog);

// Delete a blog
router.delete('/:id', blogController.deleteBlog);

// Like/Unlike a blog
router.post('/:id/like', blogController.toggleLike);

// Add comment to a blog
router.post('/:id/comment', blogController.addComment);

module.exports = router;