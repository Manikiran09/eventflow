const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
} = require('../controllers/eventController');
const { protect, organizer } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all events (public)
router.get('/', getEvents);

// ✅ MUST come BEFORE /:id — otherwise Express thinks "myevents" is an ID
router.get('/myevents', protect, organizer, getMyEvents);

// Get single event by ID (public)
router.get('/:id', getEventById);

// Create event (organizer only, with image upload)
router.post('/', protect, organizer, upload.single('image'), createEvent);

// Update event (with optional image)
router.put('/:id', protect, upload.single('image'), updateEvent);

// Delete event
router.delete('/:id', protect, deleteEvent);

module.exports = router;