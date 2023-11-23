const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {});

  // This is to show the connection in the console
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
