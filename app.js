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

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

// 1) Global middleware
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('short'));
}

// Limiting request from same API
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 1000,
  message: 'Too many request from this IP. Please try again in an hour.'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Dùng qs để xử lý các query lồng nhau có trong route
app.set('query parser', (str) =>
  qs.parse(str, { depth: 5, parameterLimit: 1000 })
);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsAverage',
//       'ratingsQuantity',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Routes
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/control-log', controlLogRouter);
app.use('/api/v1/device-control', deviceControlRouter);
app.use('/api/v1/device', deviceRouter);
app.use('/api/v1/sensor-data-archieve', sensorDataArchieveRouter);
app.use('/api/v1/sensor-data', sensorDataRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notifications', notificationRouter);

app.use('/api/v1/iot', iotRouter);

app.all(/./, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
