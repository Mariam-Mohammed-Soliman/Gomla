const mongoose= require('mongoose');

const broadcastMessageSchema  = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
  });

  module.exports  = mongoose.model('BroadcastMessage', broadcastMessageSchema );