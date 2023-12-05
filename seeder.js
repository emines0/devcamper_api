node; // This file is used to seed the database with data
const fs = require('fs');

const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp.js');
const Course = require('./models/Course.js');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {});

// Read JSON files
// __dirname is the current directory name
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

// Import into database
const importData = async () => {
  try {
    // Insert the bootcamps into the database
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log('Data Imported...'.green.inverse);
    // Exit the process
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // Delete all bootcamps
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    // Exit the process
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// If the third argument is '-i', then import the data
if (process.argv[2] === '-i') {
  importData();

  // If the third argument is '-d', then delete the dataa
} else if (process.argv[2] === '-d') {
  deleteData();
}
