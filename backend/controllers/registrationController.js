const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @POST /api/registrations/:eventId - register for event
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.registrationCount >= event.capacity)
      return res.status(400).json({ message: 'Event is at full capacity' });

    const existing = await Registration.findOne({ event: event._id, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already registered for this event' });

    const registration = await Registration.create({
      event: event._id, user: req.user._id,
      paymentStatus: event.price === 0 ? 'free' : 'pending'
    });

    // Increment registration count
    await Event.findByIdAndUpdate(event._id, { $inc: { registrationCount: 1 } });
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/registrations/myregistrations - get user's registrations
const getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user._id })
      .populate('event', 'title date location image category status')
      .sort({ createdAt: -1 });
    res.json(regs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/registrations/event/:eventId - get registrations for an event (organizer)
const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const regs = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email phone avatar').sort({ createdAt: -1 });
    res.json(regs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/registrations/:id - cancel registration
const cancelRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    if (reg.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await Event.findByIdAndUpdate(reg.event, { $inc: { registrationCount: -1 } });
    await reg.deleteOne();
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, getEventRegistrations, cancelRegistration };