const Blog = require('../models/blog');
const User = require('../models/user');

// Get all blogs for a user
exports.getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id })
            .populate('author', 'username')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all public blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const blogs = await Blog.find({ isPublished: true })
            .populate('author', 'username')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Blog.countDocuments({ isPublished: true });

        res.json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new blog post
exports.createBlog = async (req, res) => {
    try {
        const { title, content, tags, isPublished = true } = req.body;

        // Validation
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const blog = new Blog({
            title,
            content,
            author: req.user.id,
            tags: tags || [],
            isPublished
        });

        await blog.save();
        
        // Populate author info before sending response
        await blog.populate('author', 'username');

        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, isPublished } = req.body;

        const blog = await Blog.findOne({ _id: id, author: req.user.id });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found or unauthorized' });
        }

        // Update fields
        if (title !== undefined) blog.title = title;
        if (content !== undefined) blog.content = content;
        if (tags !== undefined) blog.tags = tags;
        if (isPublished !== undefined) blog.isPublished = isPublished;

        await blog.save();
        await blog.populate('author', 'username');

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findOneAndDelete({ _id: id, author: req.user.id });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found or unauthorized' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Like/Unlike a blog post
exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user already liked the post
        const likeIndex = blog.likes.findIndex(like => like.user.toString() === userId);

        if (likeIndex > -1) {
            // Unlike the post
            blog.likes.splice(likeIndex, 1);
        } else {
            // Like the post
            blog.likes.push({ user: userId });
        }

        await blog.save();
        await blog.populate('author', 'username');

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add comment to a blog post
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.comments.push({
            user: req.user.id,
            content: content.trim()
        });

        await blog.save();
        await blog.populate('author', 'username');
        await blog.populate('comments.user', 'username');

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};