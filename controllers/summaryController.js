const Bill = require('../models/Bill');
const Item = require('../models/Item');
const Roommate = require('../models/Roommate');
const { computeSplits } = require('../services/splitService');

exports.view = async (req, res) => {
  try {
    const billId = req.params.billId;
    const bill = await Bill.findById(billId).lean();
    if (!bill) return res.redirect('/dashboard');
    const items = await Item.find({ billId }).lean();
    const roommates = await Roommate.find({ userId: bill.userId }).lean();

    const result = await computeSplits(bill, items, roommates);

    // humanize for view: map roommate ids to names
    const rmMap = {};
    roommates.forEach(r => rmMap[r._id.toString()] = r.name);

    const paymentsReadable = result.payments.map(p => ({
      fromName: rmMap[p.from] || 'Unknown',
      toName: rmMap[p.to] || 'Unknown',
      amount: (p.amountCents / 100).toFixed(2)
    }));

    res.render('summary', { bill, items, roommates, payments: paymentsReadable });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};
