"use strict";

// Mongoose Schema
var mongoose = require('mongoose');
// Define the note;s database schema
var noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // add the favoriteCount or favorites property
  favoriteCount: {
    type: Number,
    "default": 0
  },
  // Add the favoritedBy property
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  //Assign createAt and updatedAt fields with a Date type
  timestamps: true
});

// Define the Note  model with the schema
var Note = mongoose.model('Note', noteSchema);
// Export the module
module.exports = Note;