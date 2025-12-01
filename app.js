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

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://plant-care-system-client-f12cxn4ql-tanlees-projects-acb912dc.vercel.app',
  process.env.CLIENT_URL // Backup cho custom domain
].filter(Boolean); // Loại bỏ undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // 1. Cho phép requests không có origin (ESP32, Postman, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    // 2. Kiểm tra origin có trong whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 3. Nếu là development mode, cho phép tất cả
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // 4. Reject origins không hợp lệ
    console.error(`❌ CORS blocked origin: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(helmet());

console.log('Environment:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 1000,
  message: 'Too many requests from this IP. Please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.set('query parser', (str) =>
  qs.parse(str, { depth: 5, parameterLimit: 1000 })
);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(hpp());

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('🔍 Request Info:');
    console.log('  Origin:', req.headers.origin || 'No origin');
    console.log('  Method:', req.method);
    console.log('  Path:', req.path);
    console.log('  Time:', req.requestTime);
    next();
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    allowedOrigins: allowedOrigins
  });
});

//3) Routes
app.use('/api/v1/iot', iotRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/control-log', controlLogRouter);
app.use('/api/v1/device-control', deviceControlRouter);
app.use('/api/v1/device', deviceRouter);
app.use('/api/v1/sensor-data-archieve', sensorDataArchieveRouter);
app.use('/api/v1/sensor-data', sensorDataRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notifications', notificationRouter);

app.all(/./, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
