const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Educational', 'Business', 'Entertainment', 'Social', 'Sports'],
    required: true
  },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String, required: true },
  venue: { type: String, default: '' },
  image: { type: String, default: '' },
  capacity: { type: Number, required: true, default: 100 },
  price: { type: Number, default: 0 }, // 0 = free
  tags: [{ type: String }],
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  featured: { type: Boolean, default: false },
  registrationCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);