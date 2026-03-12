const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const ensureAuth = require('../middleware/ensureAuth.js');

router.get('/assign', ensureAuth, itemController.assignPage);
router.post('/add', ensureAuth, itemController.addItem);
router.post('/finish', ensureAuth, itemController.finish);

module.exports = router;
