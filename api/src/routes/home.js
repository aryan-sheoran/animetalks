const express = require('express');
const router = express.Router();
const { getHomeItems, getHomeItemById } = require('../controllers/homeController.js');

router.get('/', getHomeItems);
router.get('/:id', getHomeItemById);


module.exports = router;
