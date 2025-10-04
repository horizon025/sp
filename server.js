const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests
});
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Schemas
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const Post = mongoose.model('Post', postSchema);

const commentSchema = new mongoose.Schema({
    postId: { type: String, required: true },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
});
const Comment = mongoose.model('Comment', commentSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// API Endpoints
app.get('/api/posts', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const posts = await Post.find(query).sort({ date: -1 }).limit(10);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
    try {
        const post = new Post(req.body);
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error saving post', error });
    }
});

app.get('/api/comments/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId, approved: true }).sort({ date: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
});

app.post('/api/comments', authenticateToken, async (req, res) => {
    try {
        const comment = new Comment({ ...req.body, approved: false });
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error saving comment', error });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Admin Dashboard
app.get('/admin/comments', authenticateToken, async (req, res) => {
    if (req.user.username !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const comments = await Comment.find().sort({ date: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
});

app.put('/admin/comments/:id/approve', authenticateToken, async (req, res) => {
    if (req.user.username !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error approving comment', error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
