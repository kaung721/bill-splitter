module.exports = function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  // If request expects JSON, send 401; otherwise redirect to home
  if (req.xhr || req.get('Accept').includes('json')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.redirect('/');
};
