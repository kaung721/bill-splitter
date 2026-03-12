const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // owner
  storeName: { type: String, required: true },
  category: { type: String, default: 'Other' },
  totalAmountCents: { type: Number, required: true }, // store in cents
  paidBy: { type: Schema.Types.ObjectId, ref: 'Roommate', required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  status: { type: String, enum: ['draft', 'finalized'], default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', BillSchema);
