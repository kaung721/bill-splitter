// require google's oauth2 strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec();
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  // configure passport to use google strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const name = profile.displayName || email || 'Unknown';
      
      // find or create user
      let user = await User.findOne({ $or: [{ googleId }, { email }] }).exec();
      if (!user) {
        user = new User({
          googleId,
          email,
          name
        });
        await user.save();
      } else {
        // update name/email if missing
        let changed = false;
        if (!user.googleId) { user.googleId = googleId; changed = true; }
        if (!user.name && name) { user.name = name; changed = true; }
        if (!user.email && email) { user.email = email; changed = true; }
        if (changed) await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  // configure passport to use github strategy
  const GitHubStrategy = require('passport-github2').Strategy;
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const githubId = profile.id;
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const name = profile.displayName || email || 'Unknown';
      // find or create user
      let user = await User.findOne({ $or: [{ githubId }, { email }] }).exec();
      if (!user) {
        user = new User({
          githubId,
          email,
          name
        });
        await user.save();
      }
      else {
        // update name/email if missing
        let changed = false;
        if (!user.githubId) { user.githubId = githubId; changed = true; }
        if (!user.name && name) { user.name = name; changed = true; }
        if (!user.email && email) { user.email = email; changed = true; }
        if (changed) await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};
