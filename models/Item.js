const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  billId: { type: Schema.Types.ObjectId, ref: 'Bill', required: true },
  name: { type: String, required: true },
  priceCents: { type: Number, required: true }, // cents
  assignedTo: { type: Schema.Types.ObjectId, ref: 'Roommate', required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
