// filepath: /server/src/models/index.js
const mongoose = require('mongoose');
const User = require('./user');
const Blog = require('./blog');
const Review = require('./Review');

const models = {
    User: User,
    Blog: Blog,
    Review: Review,
};

module.exports = models;