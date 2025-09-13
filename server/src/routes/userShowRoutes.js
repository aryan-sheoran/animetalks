const express = require('express');
const router = express.Router();
const { getUserShows, addShowToUser, removeShowFromUser } = require('../controllers/userShowController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getUserShows);
router.post('/', verifyToken, addShowToUser);
router.delete('/:id', verifyToken, removeShowFromUser);

module.exports = router;
