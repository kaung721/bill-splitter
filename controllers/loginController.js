const passport = require('passport');

// Show login page
exports.showLoginForm = (req, res) => {
  res.render('login'); // renders views/login.hbs
};

// Handle local login
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

// Handle logout
exports.logoutUser = (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err);
      return res.redirect('/dashboard');
    }
    res.redirect('/login');
  });
};
