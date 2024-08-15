"use strict";

var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }
}, {
  // Assigns createdAt and updatedAt field with a data type
  timestamps: true
});
var User = mongoose.model('User', UserSchema);
module.exports = User;