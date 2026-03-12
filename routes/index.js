const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/dashboard', dashboardController.index);

module.exports = router;
