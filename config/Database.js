const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
  }

  connect() {
    console.log('Connecting to database...');
    mongoose.set('strictQuery', true);

    // Return the promise so you can await or chain it
    return mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('Connected to database');
      this.connection = mongoose.connection;
    }).catch(err => {
      console.error('Database connection error:', err);
    });
  }
}

module.exports = Database;
