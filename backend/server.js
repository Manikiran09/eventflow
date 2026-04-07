// Main Express server entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const normalizeOrigin = (value) => (value || '').trim().replace(/\/$/, '');

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
	.split(',')
	.map((origin) => normalizeOrigin(origin))
	.filter(Boolean);

// Middleware
app.use(cors({
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);
		if (process.env.NODE_ENV !== 'production') {
			return callback(null, true);
		}
		const requestOrigin = normalizeOrigin(origin);
		if (allowedOrigins.includes('*') || allowedOrigins.includes(requestOrigin)) {
			return callback(null, true);
		}
		return callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
}));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', 1);
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'EventFlow API Running ✅' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));