"use strict";

var Query = require('./query');
var Mutation = require('./mutation');
var Note = require('./note');
var User = require('./user');
module.exports = {
  Query: Query,
  Mutation: Mutation,
  Note: Note,
  User: User
};