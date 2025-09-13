const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./user');
const blogRoutes = require('./blog');
const reviewRoutes = require('./reviewRoutes');
const showRoutes = require('./showRoutes');
const seasonRatingRoutes = require('./seasonRatingRoutes');
const userShowRoutes = require('./userShowRoutes');
const homeRoutes = require('./home');


router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/reviews', reviewRoutes);
router.use('/shows', showRoutes);
router.use('/ratings', seasonRatingRoutes);
router.use('/user-shows', userShowRoutes);
router.use('/home', homeRoutes);


module.exports = router;