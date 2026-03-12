const Bill = require("../models/Bill");
const Roommate = require("../models/Roommate");

exports.index = async (req, res) => {
  if (!req.user) {
    return res.render("index");
  }
  try {
    const userId = req.user._id;
    // load roommates and bills for the user
    const roommates = await Roommate.find({ userId }).lean();
    const bills = await Bill.find({ userId }).populate("paidBy").lean();
    res.render("dashboard", { user: req.user, roommates, bills });
  } catch (err) {
    // render dashboard without data on error
    console.error(err);
    res.render("dashboard", { user: req.user, roommates: [], bills: [] });
  }
};
