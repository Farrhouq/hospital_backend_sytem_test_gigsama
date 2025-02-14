const mongoose = require('mongoose');
const crypto = require('crypto-js');

const noteSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  checklist: { type: Array, default: [] },
  plan: { type: Array, default: [] }
});

noteSchema.pre('save', function (next) {
  this.content = crypto.AES.encrypt(this.content, process.env.JWT_SECRET).toString();
  next();
});

module.exports = mongoose.model('Note', noteSchema);
