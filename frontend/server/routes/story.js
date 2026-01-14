const express = require('express');
const router = express.Router();
const storyController = require('../controller/story');

// Get all stories
router.get('/', storyController.getStories);

// Get single story
router.get('/:id', storyController.getStoryById);

// Create new story
router.post('/', storyController.createStory);

// Update story
router.put('/:id', storyController.updateStory);

// Delete story
router.delete('/:id', storyController.deleteStory);

// Like/Unlike story
router.post('/:id/like', storyController.toggleLike);

// Add comment to story
router.post('/:id/comment', storyController.addComment);

// Get user's stories
router.get('/user/:userId', storyController.getUserStories);

module.exports = router;