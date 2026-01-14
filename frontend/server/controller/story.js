const Story = require("../models/story");

// Get all stories with pagination
exports.getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    let query = { isPublic: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    const stories = await Story.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Story.countDocuments(query);

    res.json({
      stories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStories: total,
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

// Get single story by ID
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id).lean();
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
};

// Create new story
exports.createStory = async (req, res) => {
  try {
    const story = await Story.create(req.body);
    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
};

// Update story
exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(updatedStory);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
};

// Delete story
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStory = await Story.findByIdAndDelete(id);
    
    if (!deletedStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
};

// Like/Unlike story
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName } = req.body;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const existingLike = story.likes.find(like => like.userId === userId);
    
    if (existingLike) {
      // Remove like
      story.likes = story.likes.filter(like => like.userId !== userId);
    } else {
      // Add like
      story.likes.push({ userId, userName });
    }

    await story.save();
    res.json({ likes: story.likes.length, isLiked: !existingLike });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// Add comment to story
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, comment } = req.body;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.comments.push({
      userId,
      userName,
      comment,
      createdAt: new Date(),
    });

    await story.save();
    res.json({ message: 'Comment added successfully', comments: story.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get user's stories
exports.getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    const stories = await Story.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(stories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ error: 'Failed to fetch user stories' });
  }
};