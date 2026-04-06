const Event = require('../models/Event');

// @GET /api/events - get all events with filters
const getEvents = async (req, res) => {
  try {
    const { category, search, location, status, featured } = req.query;
    const query = {};
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (status) query.status = status;
    if (featured) query.featured = true;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];

    const events = await Event.find(query).populate('organizer', 'name email avatar').sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email avatar bio');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/events
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, endDate, location, venue, capacity, price, tags } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const event = await Event.create({
      title, description, category, date, endDate, location, venue,
      capacity: capacity || 100, price: price || 0,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      image, organizer: req.user._id
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const updatable = ['title', 'description', 'category', 'date', 'endDate', 'location', 'venue', 'capacity', 'price', 'status', 'featured'];
    updatable.forEach(field => { if (req.body[field] !== undefined) event[field] = req.body[field]; });
    if (req.file) event.image = `/uploads/${req.file.filename}`;
    if (req.body.tags) event.tags = req.body.tags.split(',').map(t => t.trim());

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/events/organizer/myevents
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getMyEvents };