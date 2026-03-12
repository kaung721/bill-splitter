const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const ensureAuth = require('../middleware/ensureAuth.js');

router.get('/:billId', ensureAuth, summaryController.view);

module.exports = router;
