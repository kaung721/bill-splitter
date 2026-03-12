const Roommate = require('../models/Roommate');
const User = require('../models/User');

// List roommates
exports.list = async (req, res) => {
  const userId = req.user._id;
  const roommates = await Roommate.find({ userId }).lean();
  const edit = req.query.edit === 'true';
  res.render('roommates', { roommates, edit });
};

// Add roommate
exports.add = async (req, res) => {
  const userId = req.user._id;
  const { name } = req.body;

  if (!name || !name.trim()) {
    req.flash('error', 'Name required');
    return res.redirect('/roommates');
  }

  const rm = new Roommate({ userId, name: name.trim() });
  await rm.save();
  await User.findByIdAndUpdate(userId, { $push: { roommates: rm._id } });

  res.redirect('/roommates');
};

// Update roommate
exports.update = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    req.flash('error', 'Name required');
    return res.redirect('/roommates?edit=true');
  }

  await Roommate.findOneAndUpdate({ _id: id, userId }, { name: name.trim() });
  res.redirect('/roommates?edit=true');
};

// Delete roommate
exports.delete = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  await Roommate.findOneAndDelete({ _id: id, userId });
  await User.findByIdAndUpdate(userId, { $pull: { roommates: id } });

  res.redirect('/roommates?edit=true');
};
