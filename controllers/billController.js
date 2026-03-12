const Bill = require('../models/Bill');
const Roommate = require('../models/Roommate');

exports.newForm = async (req, res) => {
  // Render form with user's roommates
  const roommates = await Roommate.find({ userId: req.user._id }).lean();
  res.render('bill_new', { roommates });
};

exports.create = async (req, res) => {
  // Expect storeName, totalAmount (decimal), category, paidBy (roommate id)
  try {
    const { storeName, totalAmount, category, paidBy } = req.body;
    if (!storeName || !totalAmount || !paidBy) {
      req.flash('error', 'Please fill required fields');
      return res.redirect('/bills/new');
    }
    const totalCents = Math.round(parseFloat(totalAmount) * 100);
    const bill = new Bill({
      userId: req.user._id,
      storeName: storeName.trim(),
      category: category || 'Other',
      totalAmountCents: totalCents,
      paidBy
    });
    await bill.save();
    // redirect to assign items page
    res.redirect(`/items/assign?bill=${bill._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create bill');
    res.redirect('/bills/new');
  }
};
