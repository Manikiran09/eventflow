// Main Express server entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
	console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
	process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

const normalizeOrigin = (value) => (value || '').trim().replace(/\/$/, '');

const configuredOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';

const getOriginHost = (origin) => {
	try {
		return new URL(origin).host.toLowerCase();
	} catch {
		return '';
	}
};

const normalizeAllowedOrigin = (value) => normalizeOrigin(value).toLowerCase();

const originMatches = (allowedOrigin, requestOrigin) => {
	if (allowedOrigin === '*') return true;
	if (allowedOrigin === requestOrigin) return true;

	const requestHost = getOriginHost(requestOrigin);
	if (!requestHost) return false;

	// Allow host-only entries like "eventflow-gilt.vercel.app".
	if (!allowedOrigin.startsWith('http://') && !allowedOrigin.startsWith('https://') && !allowedOrigin.includes('*')) {
		return allowedOrigin === requestHost;
	}

	// Allow host wildcard entries like "*.vercel.app".
	if (allowedOrigin.startsWith('*.')) {
		const suffix = allowedOrigin.slice(1); // ".vercel.app"
		return requestHost.endsWith(suffix);
	}

	// Allow scheme-prefixed wildcard entries like "https://*.vercel.app".
	if (allowedOrigin.includes('*.')) {
		const wildcardIndex = allowedOrigin.indexOf('*.');
		const prefix = allowedOrigin.slice(0, wildcardIndex);
		const suffix = allowedOrigin.slice(wildcardIndex + 1); // includes leading "."
		return requestOrigin.startsWith(prefix) && requestOrigin.endsWith(suffix);
	}

	return false;
};

const allowedOrigins = configuredOrigins
	.split(',')
	.map((origin) => normalizeAllowedOrigin(origin))
	.filter(Boolean);

// Middleware
app.use(cors({
	origin: true,
	credentials: true,
}));
app.options('*', cors());
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