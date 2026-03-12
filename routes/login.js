const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Show login page
router.get('/', loginController.showLoginForm);

// Handle local login POST
router.post('/', loginController.loginUser);

// Logout route
router.get('/logout', loginController.logoutUser);

module.exports = router;
