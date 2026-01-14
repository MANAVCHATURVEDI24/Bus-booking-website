const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 150,
  },
  content: {
    type: String,
    required: true,
    maxlength: 3000,
  },
  category: {
    type: String,
    enum: ['general', 'routes', 'tips', 'complaints', 'suggestions'],
    default: 'general',
  },
  tags: [{
    type: String,
    maxlength: 20,
  }],
  replies: [{
    userId: String,
    userName: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
    likes: [{
      userId: String,
      userName: String,
    }],
  }],
  views: {
    type: Number,
    default: 0,
  },
  isSticky: {
    type: Boolean,
    default: false,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Forums", forumSchema);