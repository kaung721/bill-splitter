const express = require('express');
const router = express.Router();
const roommateController = require('../controllers/roommateController');
const ensureAuth = require('../middleware/ensureAuth.js');

router.get('/', ensureAuth, roommateController.list);
router.post('/add', ensureAuth, roommateController.add);
router.post('/update/:id', ensureAuth, roommateController.update);
router.post('/delete/:id', ensureAuth, roommateController.delete);

module.exports = router;
