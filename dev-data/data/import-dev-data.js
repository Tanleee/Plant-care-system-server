const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });
const fs = require('fs');

const User = require('./../../models/userModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => console.log('DB connection successful!'));

// Read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-vn.json`, { encoding: 'utf-8' })
);
const user = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, { encoding: 'utf-8' })
);
const review = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews-vn.json`, { encoding: 'utf-8' })
);

const importData = async () => {
  try {
    await User.create(user, { validateBeforeSave: false });

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
