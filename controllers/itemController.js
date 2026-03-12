const Bill = require('../models/Bill');
const Item = require('../models/Item');
const Roommate = require('../models/Roommate');

exports.assignPage = async (req, res) => {
  // Render page to assign items to roommates
  try {
    const billId = req.query.bill;
    if (!billId) return res.redirect('/dashboard');

    const bill = await Bill.findById(billId).populate('items').lean();
    const roommates = await Roommate.find({ userId: req.user._id }).lean();
    const items = await Item.find({ billId }).lean();

    items.forEach(it => it.price = (it.priceCents / 100).toFixed(2));
    res.render('assign_items', { bill, items, roommates });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

exports.addItem = async (req, res) => {
  try {
    // Add a new item to a bill
    const { billId, name, price, assignedTo } = req.body;
    // validate
    if (!billId || !name || !price) {
      req.flash('error', 'Missing item fields');
      return res.redirect(`/items/assign?bill=${billId}`);
    }
    const priceCents = Math.round(parseFloat(price) * 100);
    const item = new Item({
      billId,
      name: name.trim(),
      priceCents,
      assignedTo: assignedTo || null
    });
    await item.save();
    // attach to bill
    await Bill.findByIdAndUpdate(billId, { $push: { items: item._id } });
    res.redirect(`/items/assign?bill=${billId}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add item');
    res.redirect(`/items/assign?bill=${req.body.billId || ''}`);
  }
};

exports.finish = async (req, res) => {
  try {
    const { billId } = req.body;
    const bill = await Bill.findById(billId).populate('items');
    if (!bill) {
      req.flash('error', 'Bill not found');
      return res.redirect('/dashboard');
    }
    // compute sum of items
    const items = await Item.find({ billId }).lean();
    const sum = items.reduce((s, it) => s + (it.priceCents || 0), 0);
    if (sum !== bill.totalAmountCents) {
      req.flash('error', `Items total (${(sum/100).toFixed(2)}) does not match bill total (${(bill.totalAmountCents/100).toFixed(2)})`);
      return res.redirect(`/items/assign?bill=${billId}`);
    }
    bill.status = 'finalized';
    await bill.save();
    res.redirect(`/summary/${billId}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to finalize bill');
    res.redirect(`/items/assign?bill=${req.body.billId || ''}`);
  }
};
