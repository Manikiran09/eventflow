const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

// ✅ IMPORTANT RULE: Specific routes MUST come before dynamic routes
// If you put /:eventId first, Express thinks "myregistrations" is an ID!

// Get logged-in user's registrations
router.get('/myregistrations', protect, getMyRegistrations);

// Get all registrations for a specific event (organizer use)
router.get('/event/:eventId', protect, getEventRegistrations);

// Register for an event (POST /api/registrations/:eventId)
router.post('/:eventId', protect, registerForEvent);

// Cancel a registration
router.delete('/:id', protect, cancelRegistration);

module.exports = router;