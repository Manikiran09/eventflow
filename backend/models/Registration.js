const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['confirmed', 'waitlisted', 'cancelled'], default: 'confirmed' },
  ticketId: { type: String, unique: true },
  paymentStatus: { type: String, enum: ['free', 'paid', 'pending'], default: 'free' },
  notes: { type: String, default: '' },
}, { timestamps: true });

// Generate unique ticket ID before saving
registrationSchema.pre('save', function (next) {
  if (!this.ticketId) {
    this.ticketId = 'TKT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);