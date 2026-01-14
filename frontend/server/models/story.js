const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  route: {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  category: {
    type: String,
    enum: ['story', 'tip', 'review', 'photo'],
    default: 'story',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
    maxlength: 20,
  }],
  likes: [{
    userId: String,
    userName: String,
  }],
  comments: [{
    userId: String,
    userName: String,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }],
  isPublic: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model("Stories", storySchema);