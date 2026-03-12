const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Show registration form
router.get('/', registerController.showRegisterForm);

// Handle registration
router.post('/', registerController.registerUser);

module.exports = router;
