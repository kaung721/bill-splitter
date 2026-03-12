const User = require('../models/User');

// Show registration page
exports.showRegisterForm = (req, res) => {
  res.render('register');
};

// Handle registration form submission
exports.registerUser = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  // Required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Password length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }

  // Validation passed
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    }

    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();

    return res.redirect('/login');

  } catch (err) {
    console.error(err);
    return res.render('register', {
      errors: [{ msg: 'An error occurred during registration' }],
      name,
      email,
      password,
      password2
    });
  }
};
