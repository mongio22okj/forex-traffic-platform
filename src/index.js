require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan('combined'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
const apiVersion = process.env.API_VERSION || 'v1';
const baseUrl = `/api/${apiVersion}`;

app.use(`${baseUrl}/auth`, require('./routes/auth'));
app.use(`${baseUrl}/landing-pages`, require('./routes/landingPages'));
app.use(`${baseUrl}/campaigns`, require('./routes/campaigns'));
app.use(`${baseUrl}/analytics`, require('./routes/analytics'));
app.use(`${baseUrl}/track`, require('./routes/tracking'));
app.use(`${baseUrl}/traffic-sources`, require('./routes/trafficSources'));
app.use(`${baseUrl}/exports`, require('./routes/exports'));
app.use(`${baseUrl}/notifications`, require('./routes/notifications'));
app.use(`${baseUrl}/users`, require('./routes/users'));
app.use(`${baseUrl}/companies`, require('./routes/companies'));
app.use('/api/public', require('./routes/public'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Resource not found', path: req.path }
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API Base URL: http://localhost:${PORT}/api/${apiVersion}`);
});

module.exports = app;