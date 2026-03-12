const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: { type: String, index: true, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, index: true, unique: true, sparse: true },
  roommates: [{ type: Schema.Types.ObjectId, ref: 'Roommate' }],
  bills: [{ type: Schema.Types.ObjectId, ref: 'Bill' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
