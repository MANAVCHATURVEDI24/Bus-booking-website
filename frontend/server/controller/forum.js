const Forum = require("../models/forum");

// Get all forum posts with pagination
exports.getForumPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const posts = await Forum.find(query)
      .sort({ isSticky: -1, updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Forum.countDocuments(query);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
};

// Get single forum post by ID
exports.getForumPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Increment view count
    const post = await Forum.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
    
    if (!post) {
      return res.status(404).json({ error: 'Forum post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching forum post:', error);
    res.status(500).json({ error: 'Failed to fetch forum post' });
  }
};

// Create new forum post
exports.createForumPost = async (req, res) => {
  try {
    const post = await Forum.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({ error: 'Failed to create forum post' });
  }
};

// Update forum post
exports.updateForumPost = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await Forum.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ error: 'Forum post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating forum post:', error);
    res.status(500).json({ error: 'Failed to update forum post' });
  }
};

// Delete forum post
exports.deleteForumPost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Forum.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return res.status(404).json({ error: 'Forum post not found' });
    }

    res.json({ message: 'Forum post deleted successfully' });
  } catch (error) {
    console.error('Error deleting forum post:', error);
    res.status(500).json({ error: 'Failed to delete forum post' });
  }
};

// Add reply to forum post
exports.addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, content } = req.body;

    const post = await Forum.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Forum post not found' });
    }

    if (post.isClosed) {
      return res.status(400).json({ error: 'This discussion is closed' });
    }

    post.replies.push({
      userId,
      userName,
      content,
      createdAt: new Date(),
      likes: [],
    });

    post.updatedAt = new Date();
    await post.save();

    res.json({ message: 'Reply added successfully', replies: post.replies });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

// Like/Unlike reply
exports.toggleReplyLike = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const { userId, userName } = req.body;

    const post = await Forum.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Forum post not found' });
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const existingLike = reply.likes.find(like => like.userId === userId);
    
    if (existingLike) {
      // Remove like
      reply.likes = reply.likes.filter(like => like.userId !== userId);
    } else {
      // Add like
      reply.likes.push({ userId, userName });
    }

    await post.save();
    res.json({ likes: reply.likes.length, isLiked: !existingLike });
  } catch (error) {
    console.error('Error toggling reply like:', error);
    res.status(500).json({ error: 'Failed to toggle reply like' });
  }
};

// Get user's forum posts
exports.getUserForumPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Forum.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(posts);
  } catch (error) {
    console.error('Error fetching user forum posts:', error);
    res.status(500).json({ error: 'Failed to fetch user forum posts' });
  }
};