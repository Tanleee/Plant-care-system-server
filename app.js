const express = require('express');
const morgan = require('morgan');
const qs = require('qs');
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const controlLogRouter = require('./routes/controlLogRoutes');
const deviceControlRouter = require('./routes/deviceControlRoutes');
const deviceRouter = require('./routes/deviceRoutes');
const sensorDataArchieveRouter = require('./routes/sensorDataArchiveRoutes');
const sensorDataRouter = require('./routes/sensorDataRoutes');
const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const iotRouter = require('./routes/iotRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ CORS Configuration - CHO PHÉP NHIỀU ORIGINS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL // URL của frontend sau khi deploy
];

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, ESP32)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// 1) Global middleware
console.log('Environment:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Limiting request from same API
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 1000,
  message: 'Too many requests from this IP. Please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Query parser
app.set('query parser', (str) =>
  qs.parse(str, { depth: 5, parameterLimit: 1000 })
);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization and prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Request time middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Health check endpoint (cho monitoring và keep-alive)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 3) Routes
app.use('/api/v1/iot', iotRouter); // IoT routes trước để không bị authentication
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/control-log', controlLogRouter);
app.use('/api/v1/device-control', deviceControlRouter);
app.use('/api/v1/device', deviceRouter);
app.use('/api/v1/sensor-data-archieve', sensorDataArchieveRouter);
app.use('/api/v1/sensor-data', sensorDataRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notifications', notificationRouter);

// Handle undefined routes
// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
