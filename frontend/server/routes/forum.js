const express = require('express');
const router = express.Router();
const forumController = require('../controller/forum');

// Get all forum posts
router.get('/', forumController.getForumPosts);

// Get single forum post
router.get('/:id', forumController.getForumPostById);

// Create new forum post
router.post('/', forumController.createForumPost);

// Update forum post
router.put('/:id', forumController.updateForumPost);

// Delete forum post
router.delete('/:id', forumController.deleteForumPost);

// Add reply to forum post
router.post('/:id/reply', forumController.addReply);

// Like/Unlike reply
router.post('/:id/reply/:replyId/like', forumController.toggleReplyLike);

// Get user's forum posts
router.get('/user/:userId', forumController.getUserForumPosts);

module.exports = router;