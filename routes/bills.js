const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const ensureAuth = require('../middleware/ensureAuth.js');

router.get('/new', ensureAuth, billController.newForm);
router.post('/new', ensureAuth, billController.create);

module.exports = router;
