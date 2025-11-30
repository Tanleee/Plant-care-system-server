const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });
const fs = require('fs');

const User = require('./../../models/userModel');
const ControlLog = require('./../../models/controlLogModel');
const Device = require('./../../models/deviceModel');
const DeviceControl = require('./../../models/deviceControlModel');
const SensorData = require('./../../models/sensorDataModel');
const SensorDataArchieve = require('./../../models/sensorDataArchiveModel');
const Notification = require('./../../models/notificationModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => console.log('DB connection successful!'));

// Read json file
const controlLog = JSON.parse(
  fs.readFileSync(`${__dirname}/controlLog.json`, { encoding: 'utf-8' })
);
const device = JSON.parse(
  fs.readFileSync(`${__dirname}/device.json`, { encoding: 'utf-8' })
);
const deviceControl = JSON.parse(
  fs.readFileSync(`${__dirname}/deviceControl.json`, { encoding: 'utf-8' })
);
const sensorData = JSON.parse(
  fs.readFileSync(`${__dirname}/sensorData.json`, { encoding: 'utf-8' })
);
const sensorDataArchieve = JSON.parse(
  fs.readFileSync(`${__dirname}/sensorDataArchieve.json`, { encoding: 'utf-8' })
);
const user = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, { encoding: 'utf-8' })
);
const notifications = JSON.parse(
  fs.readFileSync(`${__dirname}/notifications.json`, { encoding: 'utf-8' })
);

const importData = async () => {
  try {
    await ControlLog.create(controlLog, { validateBeforeSave: false });
    await Device.create(device, { validateBeforeSave: false });
    await DeviceControl.create(deviceControl, { validateBeforeSave: false });
    await SensorData.create(sensorData, { validateBeforeSave: false });
    await SensorDataArchieve.create(sensorDataArchieve, {
      validateBeforeSave: false
    });
    await User.create(user, { validateBeforeSave: false });
    await Notification.create(notifications, { validateBeforeSave: false });

    console.log('Data sucessfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from database
const deleteData = async () => {
  try {
    await User.deleteMany({});
    await ControlLog.deleteMany({});
    await Device.deleteMany({});
    await DeviceControl.deleteMany({});
    await SensorData.deleteMany({});
    await SensorDataArchieve.deleteMany({});
    await Notification.deleteMany({});

    console.log('Data sucessfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
// console.log(process.argv);
