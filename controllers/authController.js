exports.loginSuccess = (req, res) => {
  // after passport OAuth success
  res.redirect('/dashboard');
};

exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
};
